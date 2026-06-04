import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Link from "next/link";

export const metadata = {
  title: "Blog — NavkarOS",
  description: "Insights on Indian logistics, customs, freight, and trade from the NavkarOS team.",
};

const posts = [
  {
    date: "28 May 2025",
    tag: "Customs",
    title: "How AI is Transforming Bill of Entry Preparation in India",
    excerpt: "Filing a Bill of Entry used to mean hours of manual data entry. We break down how AI document extraction is cutting BE preparation time by 80%.",
    readTime: "5 min read",
  },
  {
    date: "15 May 2025",
    tag: "GST",
    title: "GSTR-1 for Freight Forwarders: The Complete 2025 Guide",
    excerpt: "Freight invoicing has always been complex — ocean freight, agent charges, handling, and documentation all need to be split correctly. Here's how to get it right.",
    readTime: "8 min read",
  },
  {
    date: "3 May 2025",
    tag: "Trade",
    title: "India-UAE CEPA: What Exporters Need to Know in 2025",
    excerpt: "The India-UAE CEPA offers significant tariff benefits for Indian exporters. We explain eligibility, origin criteria, and how to claim the benefit.",
    readTime: "6 min read",
  },
  {
    date: "20 Apr 2025",
    tag: "Operations",
    title: "Why CFS Operators Are Leaving Excel Behind",
    excerpt: "Container tracking on spreadsheets works until it doesn't. We spoke to 12 CFS operators about the tipping point that pushed them to purpose-built software.",
    readTime: "4 min read",
  },
  {
    date: "8 Apr 2025",
    tag: "Compliance",
    title: "E-Way Bill Automation for Transporters: A Practical Guide",
    excerpt: "Auto-generating e-way bills from LR data eliminates a major source of compliance errors. Here's what you need to know about setting it up.",
    readTime: "5 min read",
  },
  {
    date: "25 Mar 2025",
    tag: "Industry",
    title: "The State of Indian Logistics Tech in 2025",
    excerpt: "India's logistics sector is undergoing a digital transformation — but adoption is uneven. We survey the landscape and highlight where the biggest gains are being made.",
    readTime: "10 min read",
  },
];

const tagColors: Record<string, string> = {
  Customs: "#5B21B6",
  GST: "#1565C0",
  Trade: "#0D7057",
  Operations: "#92400E",
  Compliance: "#D4AF37",
  Industry: "#1a1c1c",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#f9f9f9" }}>
        <section className="pt-40 pb-24 px-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#D4AF37" }}>Insights</p>
            <h1
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(40px, 5vw, 72px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.07,
              }}
              className="mb-4"
            >
              The NavkarOS Blog
            </h1>
            <p className="max-w-xl text-base mb-16" style={{ color: "#4c4546", lineHeight: 1.7, fontWeight: 300 }}>
              Practical insights on Indian logistics, customs compliance, GST, freight operations, and trade intelligence.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.title}
                  className="p-7 flex flex-col gap-4 transition-all duration-200"
                  style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest"
                      style={{ background: `${tagColors[post.tag] ?? "#1a1c1c"}12`, color: tagColors[post.tag] ?? "#1a1c1c" }}
                    >
                      {post.tag}
                    </span>
                    <span className="text-xs" style={{ color: "#7e7576" }}>{post.readTime}</span>
                  </div>
                  <h2
                    className="flex-1"
                    style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "20px", fontWeight: 400, color: "#1a1c1c", lineHeight: 1.4 }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm" style={{ color: "#4c4546", lineHeight: 1.7 }}>{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: "0.5px solid rgba(0,0,0,0.07)" }}>
                    <span className="text-xs" style={{ color: "#7e7576" }}>{post.date}</span>
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
                      Coming Soon
                    </span>
                  </div>
                </article>
              ))}
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
