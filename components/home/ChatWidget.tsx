"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Minimize2 } from "lucide-react";

// ─── Knowledge Base ───────────────────────────────────────────────────────────

interface BotEntry {
  keywords: string[];
  answer: string;
  followUps?: string[];
}

const KB: BotEntry[] = [
  // ── Overview
  {
    keywords: ["what is navkaros", "navkaros", "about navkaros", "what do you do", "what is this", "tell me about", "overview", "introduce"],
    answer: `**NavkarOS** is India's first Logistics Operating System — built exclusively for the Indian trade and logistics industry.\n\nIt replaces scattered spreadsheets, WhatsApp messages, and outdated software with one unified platform.\n\n**6 Products:**\n• Nexlog — Freight Forwarding\n• EntryX — Customs Clearance\n• DockIQ — CFS & Warehouse\n• RunDesk — Transport TMS\n• Accura — Freight Accounting\n• TradePilot — Import/Export Intelligence\n\n14-day free trial. No credit card required.`,
    followUps: ["How much does it cost?", "Is there a free trial?", "Which product is right for me?"],
  },

  // ── Which product
  {
    keywords: ["which product", "right for me", "which one", "what should i use", "recommend", "suggest", "which module", "which plan"],
    answer: `Here's a quick guide:\n\n🚢 **C&F Agent / Freight Forwarder** → Nexlog\n🛃 **Custom House Agent (CHA)** → EntryX\n🏭 **CFS / Warehouse** → DockIQ\n🚛 **Transporter / Fleet Owner** → RunDesk\n📊 **Accounting / Finance** → Accura\n📦 **Importer / Exporter** → TradePilot\n\nBundles give you the best value:\n• Forwarder Bundle (Nexlog + Accura): ₹2,699/mo\n• CHA Bundle (EntryX + Accura): ₹2,799/mo\n• Full Suite (all 6): ₹7,499/mo`,
    followUps: ["Tell me about Nexlog", "Tell me about EntryX", "Tell me about pricing"],
  },

  // ── Free Trial
  {
    keywords: ["free trial", "trial", "free", "try", "test", "demo", "try for free", "no credit card"],
    answer: `✅ **Yes! 14-day free trial on all plans.**\n\nNo credit card required. No commitment.\n\nYou get full access to the product during the trial — not a watered-down demo.\n\nAfter 14 days, choose a plan or your account pauses automatically.`,
    followUps: ["How much does it cost?", "How do I sign up?", "What's included in the trial?"],
  },

  // ── Pricing
  {
    keywords: ["price", "pricing", "cost", "how much", "fee", "charges", "rate", "plan", "subscription", "monthly", "yearly", "annual"],
    answer: `**Individual Products (per month):**\n• Nexlog — ₹1,799/mo\n• EntryX — ₹1,899/mo\n• DockIQ — ₹1,599/mo\n• RunDesk — ₹1,399/mo\n• Accura — ₹1,499/mo\n• TradePilot — ₹1,699/mo\n\n**Bundles (save more):**\n• Forwarder Bundle (Nexlog + Accura): ₹2,699/mo\n• CHA Bundle (EntryX + Accura): ₹2,799/mo\n• CFS Bundle (DockIQ + Accura): ₹2,499/mo\n• Transporter Bundle (RunDesk + Accura): ₹2,299/mo\n• Full Suite (all 6): ₹7,499/mo\n\n💡 Save 10% on Quarterly, 20% on Yearly billing.`,
    followUps: ["Is there a free trial?", "Which product is right for me?", "What is the Full Suite?"],
  },

  // ── Full Suite
  {
    keywords: ["full suite", "all products", "all modules", "everything", "complete", "all 6"],
    answer: `**Full Suite** includes all 6 products:\nNexlog + EntryX + DockIQ + RunDesk + Accura + TradePilot\n\n💰 **₹7,499/mo** — saves ₹2,395/mo vs buying individually.\n\nPerfect for large logistics companies or groups that handle multiple operations (freight, customs, CFS, transport) under one roof.`,
    followUps: ["How much does it cost?", "Is there a free trial?", "How do I sign up?"],
  },

  // ── Nexlog
  {
    keywords: ["nexlog", "freight forwarding", "freight forwarder", "c&f agent", "cf agent", "forwarding", "hawb", "hbl", "mbl", "vessel tracking", "bl"],
    answer: `**Nexlog — Freight Forwarding** (₹1,799/mo)\n\nBuilt for C&F Agents and Freight Forwarders.\n\n✅ Import & Export job management (Sea + Air)\n✅ BL / MBL / HAWB generation\n✅ Live vessel tracking\n✅ GST invoicing with Tally export\n✅ AI document extraction\n✅ Client portal (shipment tracking by PIN)\n✅ WhatsApp notifications\n✅ CRM — leads, enquiries, quotations\n✅ Fund requests & job-wise P&L`,
    followUps: ["How much does it cost?", "Tell me about Accura", "Is there a free trial?"],
  },

  // ── EntryX
  {
    keywords: ["entryx", "customs", "cha", "custom house agent", "bill of entry", "be", "icegate", "shipping bill", "sb", "duty", "ooc", "cbic", "drawback", "customs clearance", "customs broker"],
    answer: `**EntryX — Customs Clearance** (₹1,899/mo)\n\nBuilt for Custom House Agents (CHAs).\n\n✅ Bill of Entry preparation (all 6 parts)\n✅ AI reads Invoice + Packing List → 80% auto-fill\n✅ ICEGATE-connected workflow\n✅ e-Sanchit auto-upload (saves 15-20 min per job)\n✅ Live CBIC tariff master\n✅ FTA eligibility auto-alert\n✅ Anti-dumping duty check\n✅ RoDTEP & Drawback tracking\n✅ Importer self-service portal\n✅ Per-job P&L`,
    followUps: ["What is FTA Checker?", "Tell me about TradePilot", "How much does it cost?"],
  },

  // ── DockIQ
  {
    keywords: ["dockiq", "cfs", "warehouse", "container freight station", "gate in", "gate out", "storage", "slab", "yard", "destuff", "icd", "3pl", "bonded", "ooc", "examination", "exam"],
    answer: `**DockIQ — CFS & Warehouse** (₹1,599/mo)\n\nBuilt for CFS operators, ICD operators, 3PL warehouses.\n\n✅ Mobile gate-in/out (no desktop at gate)\n✅ Storage slab billing (Apollo World Connect format)\n✅ Real-time running storage display\n✅ WhatsApp alerts when free days expire\n✅ Customs exam queue (RMS/Yellow/Red channel)\n✅ OOC auto-trigger with WhatsApp to importer\n✅ LCL destuffing management\n✅ Bulk invoice generation\n✅ Importer self-service portal`,
    followUps: ["What are storage slabs?", "Tell me about pricing", "Is there a free trial?"],
  },

  // ── RunDesk
  {
    keywords: ["rundesk", "transport", "transporter", "lr", "lorry receipt", "trip", "fleet", "driver", "gps", "tracking", "truck", "vehicle", "eway bill", "e-way", "epod", "freight invoice", "builty"],
    answer: `**RunDesk — Transport TMS** (₹1,399/mo)\n\nBuilt for road transporters and fleet operators.\n\n✅ LR (Lorry Receipt) generation in standard Indian format\n✅ GPS tracking via driver's phone — NO hardware needed (saves ₹12,000/vehicle!)\n✅ Trip management with full cost sheet\n✅ Per-trip profitability (freight - fuel - toll - driver = margin)\n✅ ePOD — recipient signs on phone at delivery\n✅ E-Way Bill generation\n✅ Vehicle compliance tracker (RC/fitness/permit/insurance)\n✅ Driver app works in phone browser — no install needed`,
    followUps: ["How does GPS tracking work?", "Tell me about pricing", "Is there a free trial?"],
  },

  // ── Accura
  {
    keywords: ["accura", "accounting", "tally", "gst", "voucher", "ledger", "invoice", "gstr", "bank reconciliation", "p&l", "balance sheet", "trial balance", "tds", "payroll", "ca", "chartered accountant"],
    answer: `**Accura — Freight Accounting** (₹1,499/mo)\n\nReplaces Tally — easier for non-accountants, familiar for CAs.\n\n✅ AI Smart Entry: type "Paid Airtel ₹2400 UPI" → voucher created automatically\n✅ All 8 voucher types (keyboard-first, like Tally, but in browser)\n✅ Bank reconciliation: upload CSV → AI matches 90% automatically\n✅ Receipt scanning: photo of bill → fields auto-filled\n✅ GSTR-1/3B auto-populated from vouchers\n✅ Per-job profitability\n✅ CA remote access\n✅ 30-day cash flow forecast\n✅ Works on mobile 📱\n\nPrice: ₹14,388/year vs Tally ₹18,000–54,000/year`,
    followUps: ["Is Accura better than Tally?", "Tell me about bundles", "Is there a free trial?"],
  },

  // ── TradePilot
  {
    keywords: ["tradepilot", "importer", "exporter", "import", "export", "landed cost", "fta", "rodtep", "drawback", "hsn", "hs code", "duty calculator", "buyer discovery", "supplier", "trade intelligence"],
    answer: `**TradePilot — Import/Export Intelligence** (₹1,699/mo)\n\nFor importers and exporters (not logistics providers).\n\n✅ HSN Scout: type product in English → get HS code + all duty rates\n✅ Landed Cost Calculator (FOB → CIF → Duty → Total door cost)\n✅ FTA Checker: check if your import qualifies for reduced duty\n✅ RoDTEP tracker: auto-calculates credit per export shipment\n✅ Duty Drawback tracker\n✅ Buyer Discovery: 1,000+ verified importers in 50+ countries\n✅ Supplier management with scorecards\n✅ FEMA compliance tracking`,
    followUps: ["What is FTA?", "Tell me about RoDTEP", "How much does it cost?"],
  },

  // ── Tally comparison
  {
    keywords: ["tally", "better than tally", "vs tally", "compare tally", "replace tally"],
    answer: `**Accura vs Tally:**\n\n| Feature | Tally | Accura |\n|---|---|---|\n| Platform | Desktop only | Cloud + Mobile |\n| First transaction | Hours of setup | 10 minutes |\n| Data entry | 100% manual | AI Smart Entry |\n| Bank reconciliation | Manual | Auto-match 90% |\n| Receipt scanning | ❌ | ✅ Photo → auto-fill |\n| Per-job P&L | ❌ | ✅ Real-time |\n| Mobile | ❌ | ✅ Full access |\n| Price | ₹18,000–54,000/yr | ₹14,388/yr |\n\nAccura is designed so any office staff can use it — no dedicated Tally operator needed.`,
    followUps: ["Tell me about Accura", "How much does it cost?", "Is there a free trial?"],
  },

  // ── GPS / No hardware
  {
    keywords: ["gps", "tracking", "no hardware", "phone tracking", "driver app", "ais 140", "hardware", "device"],
    answer: `**RunDesk GPS — No Hardware Needed! 🚛**\n\nMost GPS systems need a ₹8,000–15,000 device installed per vehicle.\n\nRunDesk uses the **driver's phone** instead:\n1. Driver gets a WhatsApp link when assigned to a trip\n2. Opens it in phone browser (no app install)\n3. Clicks "Start Trip" → phone GPS tracks location every 2 min\n4. Admin sees live position on map\n5. Driver uploads fuel receipts, toll photos from camera\n6. Recipient signs ePOD on phone screen at delivery\n\n**Saves ₹12,000 per vehicle upfront!**`,
    followUps: ["Tell me about RunDesk", "How much does it cost?", "Is there a free trial?"],
  },

  // ── FTA
  {
    keywords: ["fta", "free trade agreement", "asean", "japan fta", "uae cepa", "australia ecta", "preferential", "coo", "certificate of origin", "reduced duty"],
    answer: `**FTA Checker — Save on Import Duty**\n\nIndia has active FTAs with:\n🇯🇵 Japan · 🇰🇷 South Korea · 🇦🇪 UAE (CEPA) · 🇦🇺 Australia (ECTA)\n🇸🇬 Singapore · 🌏 ASEAN (10 countries) · 🇱🇰 Sri Lanka · 🇲🇺 Mauritius\n\nHow it works in TradePilot:\n1. Enter your HS code + origin country\n2. System checks all active FTAs\n3. Shows: MFN rate vs FTA rate, rupee saving per unit, COO document required\n\nExample: Importing electronics from South Korea under CEPA can reduce duty from 20% to 0%.`,
    followUps: ["Tell me about TradePilot", "What is RoDTEP?", "How much does it cost?"],
  },

  // ── RoDTEP
  {
    keywords: ["rodtep", "duty refund", "export incentive", "export benefit", "scrip"],
    answer: `**RoDTEP — Remission of Duties and Taxes on Exported Products**\n\nRoDTEP credits refund taxes paid on inputs used in exports.\n\nTradePilot auto-tracks this:\n✅ RoDTEP rate fetched per HS code from DGFT schedule\n✅ Credit = RoDTEP Rate × FOB Value (calculated per shipment)\n✅ Monthly chart showing accumulated credits\n✅ Scrip management (record scrip, track usage for duty payment)\n✅ Annual summary for CA and tax filing`,
    followUps: ["Tell me about TradePilot", "What is Duty Drawback?", "How much does it cost?"],
  },

  // ── Storage slabs
  {
    keywords: ["storage slab", "storage charges", "free days", "storage billing", "per day", "container storage"],
    answer: `**DockIQ Storage Slab Billing**\n\nStorage is calculated exactly like Apollo World Connect / Sanco Trans:\n\n📦 Example (20FT container):\n• Day 1–10: FREE (free period)\n• Day 11–15: ₹2,000/day (Slab 1)\n• Day 16–20: ₹3,000/day (Slab 2)\n• Day 21+: ₹4,000/day (Slab 3)\n\nDockIQ shows the importer **real-time running charges** so they can plan pickup and avoid surprise bills.\n\nAuto WhatsApp alerts sent 3 days before free days expire.`,
    followUps: ["Tell me about DockIQ", "How much does it cost?", "Is there a free trial?"],
  },

  // ── Sign up / Get started
  {
    keywords: ["sign up", "signup", "register", "get started", "create account", "how to start", "onboard", "begin"],
    answer: `**Getting started is easy:**\n\n1. Go to **navkaros.in/signup**\n2. Enter your business details\n3. Choose your product(s)\n4. Start your **14-day free trial** — no credit card needed\n5. Our team will verify your account within 4 hours\n\nNeed help choosing? Email us at **navkaros.co@gmail.com** or call **+91 90807 67398** (Mon–Sat, 9am–7pm IST).`,
    followUps: ["How much does it cost?", "Which product is right for me?", "Is there a free trial?"],
  },

  // ── Contact / Support
  {
    keywords: ["contact", "support", "help", "email", "phone", "call", "reach", "talk", "human", "team", "office", "address"],
    answer: `**NavkarOS Support**\n\n📧 navkaros.co@gmail.com\n📞 +91 90807 67398\n🕐 Mon–Sat, 9am–7pm IST\n\n📍 7, Mannady Street, George Town\nChennai — 600 001, Tamil Nadu\n\nWe respond to all queries within **1 business day**. For urgent billing issues, mention "URGENT" in your email subject.`,
    followUps: ["How do I sign up?", "Is there a free trial?", "What is NavkarOS?"],
  },

  // ── ICEGATE
  {
    keywords: ["icegate", "customs filing", "be filing", "e-sanchit", "igm", "pga", "fssai", "bis", "wpc"],
    answer: `**ICEGATE Integration in EntryX**\n\n✅ Full BE/SB preparation workflow connected to ICEGATE\n✅ e-Sanchit auto-upload (eliminates 15–20 min manual work per document)\n✅ IGM linking for containers\n✅ PGA auto-trigger: FSSAI, BIS, WPC, Plant Quarantine notifications based on HS code\n✅ Assessment status tracking\n✅ OOC date auto-recorded when granted\n\nEntryX validates the BE before submission (GSTIN format, IEC format, ADD check, FTA COO check).`,
    followUps: ["Tell me about EntryX", "How much does it cost?", "Is there a free trial?"],
  },

  // ── GST
  {
    keywords: ["gst", "gstin", "gstr", "tax invoice", "e-invoice", "einvoice", "cgst", "sgst", "igst", "gstr1", "gstr3b"],
    answer: `**GST Compliance Across NavkarOS**\n\n📊 **Accura:** GSTR-1 & GSTR-3B auto-populated from vouchers. Auto IGST/CGST+SGST detection based on party state. Missing GSTIN warnings.\n\n🛃 **EntryX:** e-Invoice support. GSTR-2A reconciliation dashboard (Green=matched, Yellow=ITC mismatch, Red=missing).\n\n🚛 **RunDesk:** E-Way Bill generation built in.\n\n🏭 **DockIQ:** GST-compliant CFS invoices with SAC codes.`,
    followUps: ["Tell me about Accura", "Tell me about EntryX", "How much does it cost?"],
  },

  // ── Mobile / App
  {
    keywords: ["mobile", "app", "phone", "android", "iphone", "ios", "pwa", "install", "play store", "app store"],
    answer: `**NavkarOS works on any device — no app install needed!**\n\nAll products run in the phone browser as a **Progressive Web App (PWA)**.\n\n📱 Special mobile features:\n• **DockIQ Gate App** — scan containers, capture photos at yard gate\n• **RunDesk Driver App** — GPS tracking, fuel receipts, ePOD signature\n• **Accura Mobile** — record any transaction on the go\n\nNo App Store. No Play Store. Just open the browser and log in.`,
    followUps: ["Tell me about RunDesk", "Tell me about DockIQ", "Is there a free trial?"],
  },

  // ── Bundles
  {
    keywords: ["bundle", "combo", "package", "forwarder bundle", "cha bundle", "cfs bundle", "transporter bundle"],
    answer: `**NavkarOS Bundles — Best Value:**\n\n📦 **Forwarder Bundle** (Nexlog + Accura)\n₹2,699/mo — save ₹599/mo\n\n📦 **CHA Bundle** (EntryX + Accura)\n₹2,799/mo — save ₹599/mo\n\n📦 **CFS Bundle** (DockIQ + Accura)\n₹2,499/mo — save ₹599/mo\n\n📦 **Transporter Bundle** (RunDesk + Accura)\n₹2,299/mo — save ₹599/mo\n\n📦 **Full Suite** (all 6 products)\n₹7,499/mo — save ₹2,395/mo\n\n💡 Save an extra 10% Quarterly or 20% Yearly.`,
    followUps: ["Which product is right for me?", "Is there a free trial?", "How do I sign up?"],
  },

  // ── Security / Data
  {
    keywords: ["secure", "security", "data", "privacy", "cloud", "server", "backup", "safe", "encrypted"],
    answer: `**Your data is safe with NavkarOS:**\n\n🔒 All data encrypted in transit (HTTPS/TLS)\n🏭 Hosted on enterprise-grade cloud infrastructure\n📦 Automatic daily backups\n🔐 Role-based access control per user\n🇮🇳 Data stored in India\n\nWe comply with Indian data protection standards. Your business data is never shared with third parties.`,
    followUps: ["How do I sign up?", "What is NavkarOS?", "Contact support"],
  },
];

// ─── Matching Engine ──────────────────────────────────────────────────────────

function findAnswer(input: string): BotEntry {
  const q = input.toLowerCase().trim();

  // Score each entry by keyword matches
  let best = KB[0];
  let bestScore = 0;

  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.split(" ").length * 2; // longer matches score higher
      else if (kw.split(" ").some((w) => q.includes(w) && w.length > 3)) score += 1;
    }
    if (score > bestScore) { bestScore = score; best = entry; }
  }

  if (bestScore === 0) {
    return {
      keywords: [],
      answer: `I'm not sure about that specific question. Here's how to get the right answer:\n\n📧 **navkaros.co@gmail.com**\n📞 **+91 90807 67398** (Mon–Sat, 9am–7pm IST)\n\nOr try one of the quick questions below 👇`,
      followUps: ["What is NavkarOS?", "How much does it cost?", "Which product is right for me?"],
    };
  }

  return best;
}

// ─── Suggested Starter Questions ─────────────────────────────────────────────

const STARTERS = [
  "What is NavkarOS?",
  "Which product is right for me?",
  "How much does it cost?",
  "Is there a free trial?",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  followUps?: string[];
}

// ─── Render markdown-lite ─────────────────────────────────────────────────────

function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((p, j) =>
      j % 2 === 1 ? <strong key={j} style={{ color: "#D4AF37" }}>{p}</strong> : p
    );
    return <span key={i}>{rendered}{i < lines.length - 1 && <br />}</span>;
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [open, setOpen]           = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [thinking, setThinking]   = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 180);
      setHasOpened(true);
    }
  }, [open]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || thinking) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    // Simulate natural thinking delay (400–900ms)
    const delay = 400 + Math.random() * 500;
    setTimeout(() => {
      const entry = findAnswer(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: entry.answer,
        followUps: entry.followUps,
      };
      setMessages((prev) => [...prev, botMsg]);
      setThinking(false);
    }, delay);
  }, [thinking]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  return (
    <>
      {/* ── Floating button ─────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!open && !hasOpened && (
          <motion.div
            className="absolute bottom-0 right-0 w-14 h-14 rounded-full"
            style={{ background: "rgba(212,175,55,0.25)" }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <AnimatePresence>
          {!open && !hasOpened && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.92 }}
              transition={{ delay: 1.8, duration: 0.3 }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md whitespace-nowrap"
              style={{ background: "#1a1c1c", border: "1px solid rgba(212,175,55,0.2)" }}
            >
              Ask NavkarBot ✦
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((v) => !v)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{ background: open ? "#1a1c1c" : "#D4AF37" }}
          aria-label="Open NavkarBot"
          type="button"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Minimize2 className="h-5 w-5 text-[#D4AF37]" />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Bot className="h-6 w-6 text-[#1a1c1c]" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Chat panel ──────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{
              width: "min(380px, calc(100vw - 2rem))",
              height: "540px",
              background: "#ffffff",
              border: "1.5px solid rgba(212,175,55,0.25)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ background: "#1a1c1c", borderBottom: "1px solid rgba(212,175,55,0.12)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}>
                <Bot className="h-4 w-4" style={{ color: "#D4AF37" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold leading-tight">NavkarBot</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.45)" }}>Always online · Instant answers</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10">
                <X className="h-4 w-4" style={{ color: "rgba(255,255,255,0.45)" }} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ background: "#f9f9f9" }}>

              {/* Welcome */}
              {messages.length === 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2.5 items-start">
                    <BotAvatar />
                    <Bubble role="assistant">
                      👋 Hi! I&apos;m <strong style={{ color: "#D4AF37" }}>NavkarBot</strong>. I know everything about NavkarOS — products, pricing, features, and more. What would you like to know?
                    </Bubble>
                  </div>
                  <div className="flex flex-col gap-2 pl-9">
                    {STARTERS.map((s) => (
                      <SuggestionChip key={s} text={s} onClick={() => sendMessage(s)} disabled={thinking} />
                    ))}
                  </div>
                </div>
              )}

              {/* History */}
              {messages.map((m) => (
                <div key={m.id}>
                  <div className={`flex gap-2.5 items-start ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    {m.role === "assistant" && <BotAvatar />}
                    <Bubble role={m.role}>
                      {renderContent(m.content)}
                    </Bubble>
                  </div>
                  {m.role === "assistant" && m.followUps && m.followUps.length > 0 && (
                    <div className="flex flex-col gap-1.5 pl-9 mt-2">
                      {m.followUps.map((f) => (
                        <SuggestionChip key={f} text={f} onClick={() => sendMessage(f)} disabled={thinking} />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Thinking dots */}
              {thinking && (
                <div className="flex gap-2.5 items-start">
                  <BotAvatar />
                  <Bubble role="assistant"><TypingDots /></Bubble>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0 border-t"
              style={{ background: "#fff", borderColor: "rgba(212,175,55,0.12)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about NavkarOS..."
                disabled={thinking}
                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl outline-none transition-all disabled:opacity-60"
                style={{ background: "#f9f9f9", border: "1.5px solid #e5e7eb", color: "#1a1c1c" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button
                type="submit"
                disabled={thinking || !input.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 disabled:opacity-40"
                style={{ background: "#D4AF37" }}
              >
                <Send className="h-4 w-4 text-[#1a1c1c]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BotAvatar() {
  return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "#1a1c1c" }}>
      <Bot className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
    </div>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div
      className="text-sm leading-relaxed px-3.5 py-2.5"
      style={{
        maxWidth: "85%",
        background: isUser ? "#D4AF37" : "#1a1c1c",
        color: isUser ? "#1a1c1c" : "rgba(255,255,255,0.88)",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        fontWeight: isUser ? 600 : 400,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {children}
    </div>
  );
}

function SuggestionChip({ text, onClick, disabled }: { text: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className="text-left text-xs px-3 py-2 rounded-xl border transition-all duration-150 font-medium disabled:opacity-50"
      style={{ background: "#fff", borderColor: "#e5e7eb", color: "#4b5563" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#D4AF37"; (e.currentTarget as HTMLElement).style.color = "#1a1c1c"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.color = "#4b5563"; }}
    >
      {text}
    </button>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: "#D4AF37" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}
