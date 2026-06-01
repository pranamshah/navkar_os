import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Navkar OS — India's Freight Forwarding OS",
  description:
    "Manage shipments, invoices, accounts, and client portal in one platform. Built for Indian C&F agents and freight forwarders.",
  openGraph: {
    title: "Navkar OS — India's Freight Forwarding OS",
    description:
      "Manage shipments, invoices, accounts, and client portal in one platform. Built for Indian C&F agents and freight forwarders.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} h-full`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
