import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // v5 reads AUTH_SECRET; fall back to NEXTAUTH_SECRET for backward compat
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  // Trust the deployment host (Vercel) — avoids UntrustedHost configuration errors
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        signInToken: { label: "Sign-in Token", type: "text" }, // OTP flow
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email) return null;

          // ── OTP sign-in token flow ──────────────────────────────────────
          if (credentials.signInToken) {
            const user = await prisma.user.findFirst({
              where: {
                email: credentials.email as string,
                otpCode: credentials.signInToken as string,
              },
            });
            if (!user || !user.otpExpiry || new Date() > user.otpExpiry) return null;
            // One-time use — clear immediately
            await prisma.user.update({
              where: { id: user.id },
              data: { otpCode: null, otpExpiry: null },
            });
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
              status: user.status,
              clientId: user.clientId,
              businessType: user.businessType,
            };
          }

          // ── Password sign-in flow (email OR clientId) ──────────────────
          if (!credentials.password) return null;

          const identifier = credentials.email as string;
          const user = identifier.includes("@")
            ? await prisma.user.findUnique({ where: { email: identifier } })
            : await prisma.user.findFirst({ where: { clientId: identifier.toUpperCase() } });

          if (!user || !user.hashedPassword) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            status: user.status,
            clientId: user.clientId,
            businessType: user.businessType,
          };
        } catch (err) {
          console.error("[auth] authorize failed:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        // Initial sign-in: populate token from DB
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { role: true, status: true, clientId: true, businessType: true, id: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.status = dbUser.status;
            token.clientId = dbUser.clientId;
            token.businessType = dbUser.businessType;
            token.userId = dbUser.id;
          }
        } catch (err) {
          console.error("[auth] jwt callback failed:", err);
        }
      } else if (trigger === "update") {
        // update() called from client (e.g. after admin approves account)
        // Re-read latest status from DB so the JWT reflects current state
        const userId = token.userId as string | undefined;
        if (userId) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: userId },
              select: { role: true, status: true, clientId: true, businessType: true },
            });
            if (dbUser) {
              token.role = dbUser.role;
              token.status = dbUser.status;
              token.clientId = dbUser.clientId;
              token.businessType = dbUser.businessType;
            }
          } catch (err) {
            console.error("[auth] jwt refresh on update failed:", err);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        session.user.clientId = token.clientId as string;
        session.user.businessType = token.businessType as string;
        session.user.id = token.userId as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existing = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          if (!existing) {
            // Generate clientId: 3 letters from name + 5 digits, no hyphens
            const prefix = (user.name ?? "")
              .replace(/[^a-zA-Z]/g, "")
              .toUpperCase()
              .slice(0, 3)
              .padEnd(3, "X");
            let clientId = `${prefix}${Math.floor(10000 + Math.random() * 90000)}`;
            // Ensure uniqueness
            let attempts = 0;
            while (await prisma.user.findUnique({ where: { clientId } })) {
              clientId = `${prefix}${Math.floor(10000 + Math.random() * 90000)}`;
              if (++attempts > 10) throw new Error("Could not generate unique client ID");
            }
            await prisma.user.create({
              data: {
                clientId,
                name: user.name ?? "New User",
                email: user.email!,
                image: user.image,
                role: "CLIENT",
                status: "PENDING_VERIFICATION",
              },
            });
          }
        } catch (err) {
          console.error("[auth] google user upsert:", err);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Always honour same-origin callback URLs (covers sign-out callbackUrl: "/",
      // Google sign-in callbackUrl: "/status", etc.)
      if (url.startsWith(baseUrl)) return url;
      // External URLs — send to base, routing continues from there
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
