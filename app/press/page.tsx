import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Link from "next/link";

export const metadata = {
  title: "Press Kit — NavkarOS",
  description: "Media resources, brand assets, and press contacts for NavkarOS.",
};

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#f9f9f9" }}>
        <section className="pt-40 pb-24 px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#1E40AF" }}>Press</p>
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
              Press Kit
            </h1>
            <p className="max-w-2xl text-base mb-16" style={{ color: "#4c4546", lineHeight: 1.7, fontWeight: 300 }}>
              Resources for journalists and media covering NavkarOS and the Indian logistics technology sector.
            </p>

            {/* About NavkarOS boilerplate */}
            <div className="mb-12 p-8" style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "#7e7576" }}>About NavkarOS — Boilerplate</h2>
              <p className="text-sm" style={{ color: "#4c4546", lineHeight: 1.85 }}>
                NavkarOS is India&apos;s first integrated logistics operating system, designed specifically for the Indian freight and trade ecosystem. Founded by Pranam S Shah and headquartered in Chennai, NavkarOS offers six modular products — Nexlog, EntryX, DockIQ, RunDesk, Accura, and TradePilot — covering every role in the logistics value chain, from freight forwarding and customs clearance to CFS management, transport, accounting, and trade intelligence. The platform replaces fragmented spreadsheets and WhatsApp workflows with a single, GST-compliant, ICEGATE-integrated system. navkaros.in
              </p>
            </div>

            {/* Key facts */}
            <div className="mb-12">
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-8" style={{ color: "#7e7576" }}>Key Facts</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { label: "Founded", value: "2024" },
                  { label: "Founder", value: "Pranam S Shah" },
                  { label: "Headquarters", value: "Chennai, Tamil Nadu, India" },
                  { label: "Sector", value: "Logistics Technology (SaaS)" },
                  { label: "Target Market", value: "Indian freight forwarders, CHAs, CFS operators, transporters, importers & exporters" },
                  { label: "Products", value: "6 modular products (Nexlog, EntryX, DockIQ, RunDesk, Accura, TradePilot)" },
                  { label: "Integrations", value: "ICEGATE, GSTN, Razorpay, Tally" },
                  { label: "Website", value: "navkaros.in" },
                ].map((f) => (
                  <div key={f.label} className="p-5" style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>{f.label}</p>
                    <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Press contact */}
            <div className="p-8" style={{ background: "#1a1c1c" }}>
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>Press Contact</h2>
              <p className="text-sm mb-1" style={{ color: "#fff" }}>Pranam S Shah — Founder & CEO</p>
              <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>NavkarOS Logistics Pvt. Ltd.</p>
              <a href="mailto:navkaros.co@gmail.com" className="text-sm" style={{ color: "#1E40AF" }}>navkaros.co@gmail.com</a>
              <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                We aim to respond to press enquiries within 4 hours during business hours (Mon–Sat, 9am–7pm IST).
              </p>
            </div>

            <div className="mt-10">
              <Link href="/" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>← Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
