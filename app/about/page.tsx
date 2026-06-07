import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

const team = [
  {
    name: "Pranam S Shah",
    role: "Founder & CEO",
    bio: "Built NavkarOS from the ground up after years of hands-on experience in Indian logistics. Frustrated by the fragmented tools, spreadsheets, and WhatsApp chaos that every freight business runs on, Pranam set out to build the operating system India's logistics industry deserves.",
  },
];

const values = [
  {
    title: "Built for the field",
    body: "Every feature starts with a real problem — from how a CHA files a Bill of Entry to how a freight forwarder tracks 40 open jobs at once.",
  },
  {
    title: "Simple over clever",
    body: "Logistics is already complex. NavkarOS stays out of your way. Clean interfaces, fast workflows, no training manuals needed.",
  },
  {
    title: "India-first, globally ready",
    body: "GST-compliant billing, Indian port codes, customs formats — built in from day one. International reach, Indian roots.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#f9f9f9" }}>
        {/* Hero */}
        <section className="pt-40 pb-24 px-8">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8" style={{ background: "#e8e8e8", color: "#4c4546" }}>
              Our Story
            </span>
            <h1
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(48px, 6vw, 80px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.07,
              }}
              className="mb-8"
            >
              Logistics runs on
              <br />
              <span style={{ color: "#D4AF37" }}>people and process.</span>
            </h1>
            <p className="max-w-2xl text-lg" style={{ color: "#4c4546", lineHeight: 1.75, fontWeight: 300 }}>
              NavkarOS was born out of frustration — too many tabs, too many WhatsApp groups, too much manual data entry. We&apos;re building the operating system that Indian freight businesses actually deserve.
            </p>
          </div>
        </section>

        {/* Mission strip */}
        <section className="px-8 py-16 border-y" style={{ borderColor: "rgba(0,0,0,0.07)", background: "#1a1c1c" }}>
          <div className="max-w-4xl mx-auto text-center">
            <p
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 400,
                color: "#fff",
                letterSpacing: "-0.01em",
                lineHeight: 1.4,
              }}
            >
              &ldquo;The goal is simple — if you run a freight business in India, NavkarOS should be the only software you need.&rdquo;
            </p>
            <p className="mt-5 text-sm" style={{ color: "#D4AF37", letterSpacing: "0.05em" }}>— Pranam S Shah, Founder & CEO</p>
          </div>
        </section>

        {/* Values */}
        <section className="px-8 py-24">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-14" style={{ color: "#7e7576" }}>What We Stand For</p>
            <div className="grid md:grid-cols-3 gap-12">
              {values.map((v) => (
                <div key={v.title}>
                  <div className="w-8 h-0.5 mb-6" style={{ background: "#D4AF37" }} />
                  <h3 className="mb-3 font-semibold text-base" style={{ color: "#1a1c1c" }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: "#7e7576", lineHeight: 1.7 }}>{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="px-8 py-24 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7e7576" }}>The Team</p>
            <p className="text-sm mb-14" style={{ color: "#4c4546" }}>A small, focused team of logistics professionals and engineers — more great people joining soon.</p>
            <div className="grid md:grid-cols-3 gap-12">
              {team.map((t) => (
                <div key={t.name} className="md:col-span-1">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black mb-5"
                    style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37" }}
                  >
                    {t.name[0]}
                  </div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: "#1a1c1c" }}>{t.name}</p>
                  <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#D4AF37" }}>{t.role}</p>
                  <p className="text-sm" style={{ color: "#7e7576", lineHeight: 1.7 }}>{t.bio}</p>
                </div>
              ))}

              {/* Hiring card */}
              <div className="p-6 border" style={{ border: "0.5px dashed rgba(212,175,55,0.4)", background: "rgba(212,175,55,0.02)" }}>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-5"
                  style={{ background: "rgba(212,175,55,0.08)" }}
                >
                  +
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: "#1a1c1c" }}>We&apos;re Hiring</p>
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#D4AF37" }}>Join the Team</p>
                <p className="text-sm mb-5" style={{ color: "#7e7576", lineHeight: 1.7 }}>
                  Passionate about logistics, software, or both? We&apos;re looking for great people to help build the future of Indian freight.
                </p>
                <Link href="/careers" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
                  View Open Roles →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-8 py-20 border-t border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { val: "2026", label: "Founded" },
              { val: "Chennai", label: "Headquartered" },
              { val: "India", label: "Market" },
              { val: "6", label: "Products in Suite" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  className="font-semibold mb-1"
                  style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "36px", color: "#1a1c1c", letterSpacing: "-0.02em" }}
                >
                  {s.val}
                </p>
                <p className="text-xs uppercase tracking-widest" style={{ color: "#7e7576" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Office */}
        <section className="px-8 py-20">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-10" style={{ color: "#7e7576" }}>Our Office</p>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="mb-2 font-semibold" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "24px", color: "#1a1c1c" }}>
                  Chennai HQ
                </h3>
                <p className="text-sm mb-1" style={{ color: "#4c4546" }}>7, Mannady Street, George Town</p>
                <p className="text-sm mb-1" style={{ color: "#4c4546" }}>Chennai — 600 001, Tamil Nadu, India</p>
                <p className="text-sm mb-6" style={{ color: "#4c4546" }}>+91 90807 67398 · hello@navkaros.in</p>
                <p className="text-sm italic" style={{ color: "#D4AF37" }}>Built in Chennai. Made for the world.</p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:hello@navkaros.in"
                  className="flex items-center justify-between px-5 py-4 border transition-all duration-200"
                  style={{ borderColor: "rgba(0,0,0,0.1)", borderWidth: "0.5px" }}
                >
                  <span className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>Email us</span>
                  <span className="text-xs" style={{ color: "#D4AF37" }}>hello@navkaros.in →</span>
                </a>
                <a
                  href="tel:+919080767398"
                  className="flex items-center justify-between px-5 py-4 border transition-all duration-200"
                  style={{ borderColor: "rgba(0,0,0,0.1)", borderWidth: "0.5px" }}
                >
                  <span className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>Call us</span>
                  <span className="text-xs" style={{ color: "#D4AF37" }}>+91 90807 67398 →</span>
                </a>
                <Link
                  href="/#contact"
                  className="flex items-center justify-between px-5 py-4 transition-all duration-200"
                  style={{ background: "#1a1c1c" }}
                >
                  <span className="text-sm font-semibold" style={{ color: "#fff" }}>Send a message</span>
                  <span className="text-xs" style={{ color: "#D4AF37" }}>Contact form →</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-8 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "48px", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }}
              className="mb-6"
            >
              Join us in building the future of Indian logistics.
            </h2>
            <div className="flex gap-4 justify-center flex-wrap mt-10">
              <Link
                href="/signup"
                className="px-10 py-4 text-xs font-semibold uppercase tracking-widest"
                style={{ background: "#1a1c1c", color: "#fff" }}
              >
                Start Free Trial
              </Link>
              <Link
                href="/#contact"
                className="px-10 py-4 text-xs font-semibold uppercase tracking-widest border"
                style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px", color: "#4c4546" }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
