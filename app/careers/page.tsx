import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Link from "next/link";

export const metadata = {
  title: "Careers — NavkarOS",
  description: "Join the team building India's logistics operating system.",
};

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#f9f9f9" }}>
        <section className="pt-40 pb-24 px-8">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-8" style={{ background: "rgba(30,64,175,0.1)", color: "#1E40AF" }}>
              Careers
            </span>
            <h1
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(40px, 5vw, 72px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.07,
              }}
              className="mb-8"
            >
              Build the future of
              <br />
              <span style={{ color: "#1E40AF" }}>Indian logistics.</span>
            </h1>
            <p className="max-w-2xl text-lg mb-16" style={{ color: "#4c4546", lineHeight: 1.75, fontWeight: 300 }}>
              We&apos;re a small team in Chennai solving real problems for hundreds of freight businesses across India. We move fast, care deeply about the product, and believe the best work comes from people who understand the industry they&apos;re building for.
            </p>

            {/* No open roles */}
            <div className="p-10 text-center" style={{ background: "#fff", border: "0.5px dashed rgba(30,64,175,0.4)" }}>
              <p className="text-sm font-semibold mb-3" style={{ color: "#1a1c1c" }}>No open roles right now</p>
              <p className="text-sm mb-6" style={{ color: "#7e7576", lineHeight: 1.7 }}>
                We&apos;re not actively hiring at the moment, but we&apos;re always interested in talking to exceptional people who are passionate about logistics and technology.
              </p>
              <a
                href="mailto:navkaros.co@gmail.com"
                className="inline-block px-8 py-3 text-xs font-semibold uppercase tracking-widest"
                style={{ background: "#1a1c1c", color: "#1E40AF" }}
              >
                Send a Speculative Application →
              </a>
              <p className="text-xs mt-4" style={{ color: "#7e7576" }}>navkaros.co@gmail.com</p>
            </div>

            {/* Perks */}
            <div className="mt-20">
              <p className="text-xs font-semibold uppercase tracking-widest mb-10" style={{ color: "#7e7576" }}>Why NavkarOS</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  { title: "Real impact", body: "Your work directly affects how hundreds of logistics businesses run their operations every day." },
                  { title: "Chennai-based", body: "We work out of George Town, Chennai — the heart of South India's trade corridor." },
                  { title: "Small & focused", body: "No bureaucracy. You'll work directly with the founder on things that actually matter." },
                  { title: "Competitive pay", body: "Market-rate salaries with equity for early joiners." },
                  { title: "Learning by doing", body: "You'll understand Indian freight, customs, and logistics from the inside out." },
                  { title: "Remote-friendly", body: "Hybrid setup — come into the office when it matters, work remotely when it doesn't." },
                ].map((p) => (
                  <div key={p.title}>
                    <div className="w-6 h-0.5 mb-4" style={{ background: "#1E40AF" }} />
                    <p className="text-sm font-semibold mb-2" style={{ color: "#1a1c1c" }}>{p.title}</p>
                    <p className="text-sm" style={{ color: "#7e7576", lineHeight: 1.7 }}>{p.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16">
              <Link href="/" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>← Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
