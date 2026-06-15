"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Minimize2, HeadphonesIcon } from "lucide-react";
import Link from "next/link";

// ─── Knowledge Base ───────────────────────────────────────────────────────────

interface BotEntry {
  id: string;
  keywords: string[];
  answer: string;
  followUps?: string[];
  supportLink?: boolean;
}

const KB: BotEntry[] = [
  {
    id: "overview",
    keywords: ["what is navkaros", "navkaros overview", "about navkaros", "what do you do", "what is this platform", "overview", "introduce yourself", "who are you"],
    answer: `**NavkarOS** is India's first Logistics Operating System — built exclusively for the Indian trade and logistics industry.\n\nIt replaces scattered spreadsheets, WhatsApp messages, and outdated software with one unified platform.\n\n**6 Products:**\n• Nexlog — Freight Forwarding\n• EntryX — Customs Clearance\n• DockIQ — CFS & Warehouse\n• RunDesk — Transport TMS\n• Accura — Freight Accounting\n• TradePilot — Import/Export Intelligence\n\n14-day free trial. No credit card required.`,
    followUps: ["Which product is right for me?", "How much does it cost?", "Is there a free trial?"],
  },
  {
    id: "which-product",
    keywords: ["which product", "right for me", "which one", "what should i use", "recommend", "suggest", "which module", "which software", "for my business"],
    answer: `Here's a quick guide:\n\n🚢 **C&F Agent / Freight Forwarder** → Nexlog\n🛃 **Custom House Agent (CHA)** → EntryX\n🏭 **CFS / Warehouse** → DockIQ\n🚛 **Transporter / Fleet Owner** → RunDesk\n📊 **Accounting / Finance** → Accura\n📦 **Importer / Exporter** → TradePilot\n\nBundles save more:\n• Forwarder Bundle (Nexlog + Accura): ₹2,699/mo\n• CHA Bundle (EntryX + Accura): ₹2,799/mo\n• Full Suite (all 6): ₹7,499/mo`,
    followUps: ["Nexlog features", "EntryX features", "How much does it cost?"],
  },
  {
    id: "free-trial",
    keywords: ["free trial", "trial", "try for free", "no credit card", "test before", "demo", "try it"],
    answer: `✅ **Yes! 14-day free trial on all plans.**\n\nNo credit card required. No commitment.\n\nYou get full access to the product during the trial — not a watered-down demo.\n\nAfter 14 days, choose a plan or your account pauses automatically.`,
    followUps: ["How much does it cost?", "How do I sign up?", "Which product is right for me?"],
  },
  {
    id: "pricing",
    keywords: ["price", "pricing", "cost", "how much", "fee", "charges", "rate", "plan", "subscription", "monthly", "yearly", "annual", "billing"],
    answer: `**Individual Products (per month):**\n• Nexlog — ₹1,799/mo\n• EntryX — ₹1,899/mo\n• DockIQ — ₹1,599/mo\n• RunDesk — ₹1,399/mo\n• Accura — ₹1,499/mo\n• TradePilot — ₹1,699/mo\n\n**Bundles (save more):**\n• Forwarder Bundle (Nexlog + Accura): ₹2,699/mo\n• CHA Bundle (EntryX + Accura): ₹2,799/mo\n• CFS Bundle (DockIQ + Accura): ₹2,499/mo\n• Transporter Bundle (RunDesk + Accura): ₹2,299/mo\n• Full Suite (all 6): ₹7,499/mo\n\n💡 Save 10% Quarterly · 20% Yearly`,
    followUps: ["Is there a free trial?", "Which product is right for me?", "Full Suite details"],
  },
  {
    id: "full-suite",
    keywords: ["full suite", "all products", "all modules", "all 6", "complete package", "everything"],
    answer: `**Full Suite** includes all 6 products:\nNexlog + EntryX + DockIQ + RunDesk + Accura + TradePilot\n\n💰 **₹7,499/mo** — saves ₹2,395/mo vs buying individually.\n\nPerfect for large logistics companies that handle freight, customs, CFS, and transport all under one roof.`,
    followUps: ["Is there a free trial?", "How do I sign up?", "How much does it cost?"],
  },
  {
    id: "nexlog",
    keywords: ["nexlog", "nexlog features", "freight forwarding", "freight forwarder", "c&f agent", "cf agent", "forwarding agent", "hawb", "hbl", "mbl", "vessel tracking", "sea freight", "air freight"],
    answer: `**Nexlog — Freight Forwarding** (₹1,799/mo)\n\nBuilt for C&F Agents and Freight Forwarders.\n\n✅ Import & Export job management (Sea + Air)\n✅ BL / MBL / HAWB generation\n✅ Live vessel tracking\n✅ GST invoicing with Tally export\n✅ AI document extraction\n✅ Client portal with PIN access\n✅ WhatsApp notifications on each stage\n✅ CRM — leads, enquiries, quotations\n✅ Fund requests & job-wise P&L`,
    followUps: ["Accura features", "Forwarder Bundle price", "Is there a free trial?"],
  },
  {
    id: "entryx",
    keywords: ["entryx", "entryx features", "customs", "cha", "custom house agent", "bill of entry", "icegate", "shipping bill", "duty", "ooc", "cbic", "drawback", "customs clearance", "customs broker", "be filing", "sb filing"],
    answer: `**EntryX — Customs Clearance** (₹1,899/mo)\n\nBuilt for Custom House Agents (CHAs).\n\n✅ Bill of Entry preparation (all 6 BE parts)\n✅ AI reads Invoice + Packing List → 80% auto-fill\n✅ ICEGATE-connected workflow\n✅ e-Sanchit auto-upload (saves 15-20 min per job)\n✅ Live CBIC tariff master with ADD check\n✅ FTA eligibility auto-alert\n✅ RoDTEP & Drawback tracking\n✅ Importer self-service portal\n✅ Per-job P&L`,
    followUps: ["What is FTA?", "Accura features", "Is there a free trial?"],
  },
  {
    id: "dockiq",
    keywords: ["dockiq", "dockiq features", "cfs", "warehouse", "container freight station", "gate in", "gate out", "storage", "slab", "yard", "destuff", "icd", "3pl", "bonded warehouse", "examination queue"],
    answer: `**DockIQ — CFS & Warehouse** (₹1,599/mo)\n\nBuilt for CFS operators, ICD operators, 3PL warehouses.\n\n✅ Mobile gate-in/out (no desktop at gate)\n✅ Storage slab billing (Apollo World Connect format)\n✅ Real-time running storage display\n✅ WhatsApp alerts when free days expire\n✅ Customs exam queue (RMS/Yellow/Red channel)\n✅ OOC auto-trigger with WhatsApp to importer\n✅ LCL destuffing management\n✅ Bulk invoice generation\n✅ Importer self-service portal`,
    followUps: ["Storage slab details", "Accura features", "Is there a free trial?"],
  },
  {
    id: "rundesk",
    keywords: ["rundesk", "rundesk features", "transport", "transporter", "lorry receipt", "trip", "fleet", "driver", "truck", "vehicle", "eway bill", "epod", "freight invoice", "builty", "lr generation", "road transport"],
    answer: `**RunDesk — Transport TMS** (₹1,399/mo)\n\nBuilt for road transporters and fleet operators.\n\n✅ LR (Lorry Receipt) in standard Indian format\n✅ GPS via driver's phone — NO hardware needed (saves ₹12,000/vehicle)\n✅ Trip management with full cost sheet\n✅ Per-trip profitability (freight − fuel − toll − driver)\n✅ ePOD — recipient signs on phone at delivery\n✅ E-Way Bill generation\n✅ Vehicle compliance tracker (RC/fitness/permit/insurance)\n✅ Driver app via phone browser — no install needed`,
    followUps: ["GPS tracking details", "Accura features", "Is there a free trial?"],
  },
  {
    id: "accura",
    keywords: ["accura", "accura features", "accounting", "tally", "voucher", "ledger", "gstr", "bank reconciliation", "tds", "payroll", "ca login", "smart entry", "freight accounting"],
    answer: `**Accura — Freight Accounting** (₹1,499/mo)\n\nReplaces Tally — easier for non-accountants, familiar for CAs.\n\n✅ AI Smart Entry: type "Paid Airtel ₹2400 UPI" → voucher auto-created\n✅ All 8 voucher types, keyboard-first like Tally but in browser\n✅ Bank reconciliation: upload CSV → AI matches 90% automatically\n✅ Receipt scanning: photo of bill → fields auto-filled\n✅ GSTR-1/3B auto-populated from vouchers\n✅ Per-job profitability in real time\n✅ CA remote access\n✅ Works on mobile 📱\n\nPrice: ₹14,388/yr vs Tally ₹18,000–54,000/yr`,
    followUps: ["Accura vs Tally", "Is there a free trial?", "How much does it cost?"],
  },
  {
    id: "tradepilot",
    keywords: ["tradepilot", "tradepilot features", "importer", "exporter", "landed cost", "fta checker", "rodtep", "hsn", "hs code", "duty calculator", "buyer discovery", "supplier", "trade intelligence", "import export"],
    answer: `**TradePilot — Import/Export Intelligence** (₹1,699/mo)\n\nFor importers and exporters.\n\n✅ HSN Scout: type product in English → HS code + all duty rates\n✅ Landed Cost Calculator (FOB → CIF → Duty → Total door cost)\n✅ FTA Checker: check if your import qualifies for reduced duty\n✅ RoDTEP tracker: credit per export shipment auto-calculated\n✅ Duty Drawback tracker\n✅ Buyer Discovery: 1,000+ verified importers in 50+ countries\n✅ Supplier management with scorecards\n✅ FEMA compliance tracking`,
    followUps: ["What is FTA?", "RoDTEP explained", "Is there a free trial?"],
  },
  {
    id: "tally-compare",
    keywords: ["accura vs tally", "better than tally", "vs tally", "compare tally", "replace tally", "tally alternative"],
    answer: `**Accura vs Tally:**\n\n| | Tally | Accura |\n|---|---|---|\n| Platform | Desktop only | Cloud + Mobile |\n| Setup | Hours | 10 minutes |\n| Data entry | 100% manual | AI Smart Entry |\n| Bank recon | Manual | Auto 90% |\n| Receipt scan | ❌ | ✅ |\n| Per-job P&L | ❌ | ✅ |\n| Mobile | ❌ | ✅ |\n| Price | ₹18k–54k/yr | ₹14,388/yr |\n\nNo dedicated Tally operator needed — any office staff can use Accura from day one.`,
    followUps: ["Accura features", "Is there a free trial?", "How much does it cost?"],
  },
  {
    id: "gps",
    keywords: ["gps tracking", "gps details", "no hardware", "phone tracking", "driver app", "ais 140", "gps device", "vehicle tracking"],
    answer: `**RunDesk GPS — No Hardware! 🚛**\n\nOther GPS systems cost ₹8,000–15,000 per vehicle for a device.\n\nRunDesk uses the **driver's phone** instead:\n1. Driver gets WhatsApp link when assigned to a trip\n2. Opens in phone browser (no app install)\n3. Clicks "Start Trip" → GPS tracks every 2 min\n4. Admin sees live map position\n5. Driver uploads fuel receipts + toll photos via camera\n6. Recipient signs ePOD on phone screen at delivery\n\n**Saves ₹12,000 per vehicle upfront!**`,
    followUps: ["RunDesk features", "How much does it cost?", "Is there a free trial?"],
  },
  {
    id: "fta",
    keywords: ["fta", "what is fta", "free trade agreement", "asean", "japan fta", "uae cepa", "australia ecta", "preferential duty", "coo", "certificate of origin", "reduced duty"],
    answer: `**FTA — Free Trade Agreements**\n\nIndia has active FTAs where import duty can be 0%:\n🇯🇵 Japan · 🇰🇷 South Korea · 🇦🇪 UAE (CEPA)\n🇦🇺 Australia (ECTA) · 🇸🇬 Singapore · 🌏 ASEAN (10 countries)\n\nTradePilot FTA Checker:\n1. Enter HS code + origin country\n2. System checks all active FTAs\n3. Shows MFN rate vs FTA rate + rupee saving per unit + COO document required\n\nExample: Electronics from South Korea — duty drops from 20% to 0% under CEPA.`,
    followUps: ["TradePilot features", "RoDTEP explained", "How much does it cost?"],
  },
  {
    id: "rodtep",
    keywords: ["rodtep", "rodtep explained", "duty refund", "export incentive", "export benefit", "scrip", "remission"],
    answer: `**RoDTEP — Export Incentive for Indian Exporters**\n\nRoDTEP refunds taxes paid on inputs used in exports.\n\nTradePilot auto-tracks:\n✅ RoDTEP rate per HS code from DGFT schedule\n✅ Credit = Rate × FOB Value (per shipment)\n✅ Monthly chart showing accumulated credits this FY\n✅ Scrip management (track usage for duty payment)\n✅ Annual summary for CA/tax filing`,
    followUps: ["TradePilot features", "What is FTA?", "How much does it cost?"],
  },
  {
    id: "storage-slab",
    keywords: ["storage slab", "storage slab details", "storage charges", "free days", "storage billing", "per day rate", "container storage"],
    answer: `**DockIQ Storage Slab Billing**\n\nExactly matches Apollo World Connect / Sanco Trans format:\n\n📦 Example (20FT container):\n• Day 1–10: FREE\n• Day 11–15: ₹2,000/day (Slab 1)\n• Day 16–20: ₹3,000/day (Slab 2)\n• Day 21+: ₹4,000/day (Slab 3)\n\nDockIQ shows importers real-time running charges so they can plan pickup and avoid surprise bills. WhatsApp alerts 3 days before free days expire.`,
    followUps: ["DockIQ features", "Is there a free trial?", "How much does it cost?"],
  },
  {
    id: "mobile",
    keywords: ["mobile", "phone app", "android", "iphone", "ios", "pwa", "install app", "play store", "app store", "works on phone"],
    answer: `**NavkarOS works on any device — no app install needed!**\n\nAll products run in the phone browser as a PWA.\n\n📱 Special mobile features:\n• **DockIQ Gate App** — scan containers, take photos at yard\n• **RunDesk Driver App** — GPS tracking, ePOD signature\n• **Accura Mobile** — record transactions on the go\n\nNo App Store. No Play Store. Just open the browser and log in.`,
    followUps: ["RunDesk features", "DockIQ features", "Is there a free trial?"],
  },
  {
    id: "gst",
    keywords: ["gst", "gstin", "gstr", "tax invoice", "e-invoice", "cgst", "sgst", "igst", "gst compliance", "gstr1", "gstr3b"],
    answer: `**GST Compliance Across NavkarOS:**\n\n📊 **Accura** — GSTR-1 & GSTR-3B auto-populated. Auto IGST/CGST+SGST by party state. GSTR-2A reconciliation dashboard.\n\n🛃 **EntryX** — e-Invoice support, e-Sanchit integration.\n\n🚛 **RunDesk** — E-Way Bill generation built in.\n\n🏭 **DockIQ** — GST-compliant CFS invoices with correct SAC codes.`,
    followUps: ["Accura features", "EntryX features", "How much does it cost?"],
  },
  {
    id: "signup",
    keywords: ["sign up", "signup", "register", "get started", "create account", "how to start", "onboard", "begin", "how to join"],
    answer: `**Getting started is simple:**\n\n1. Go to **navkaros.in/signup**\n2. Enter your business details\n3. Choose your product(s)\n4. Start your **14-day free trial** — no credit card\n5. Team verifies your account within 4 hours\n\nNeed help? Email **navkaros.co@gmail.com** or call **+91 90807 67398** (Mon–Sat, 9am–7pm IST).`,
    followUps: ["How much does it cost?", "Is there a free trial?", "Contact support"],
  },
  {
    id: "bundles",
    keywords: ["bundle", "bundles", "forwarder bundle", "cha bundle", "cfs bundle", "transporter bundle", "combo", "package deal"],
    answer: `**NavkarOS Bundles — Best Value:**\n\n📦 **Forwarder Bundle** (Nexlog + Accura) — ₹2,699/mo\n📦 **CHA Bundle** (EntryX + Accura) — ₹2,799/mo\n📦 **CFS Bundle** (DockIQ + Accura) — ₹2,499/mo\n📦 **Transporter Bundle** (RunDesk + Accura) — ₹2,299/mo\n📦 **Full Suite** (all 6) — ₹7,499/mo (save ₹2,395/mo!)\n\n💡 Extra 10% off Quarterly · 20% off Yearly`,
    followUps: ["Which product is right for me?", "Is there a free trial?", "How do I sign up?"],
  },
  {
    id: "contact",
    keywords: ["contact", "support", "help", "email", "phone", "call", "reach", "talk to someone", "human", "team", "office", "address", "contact support"],
    answer: `**NavkarOS Support Team**\n\n📧 navkaros.co@gmail.com\n📞 +91 90807 67398\n🕐 Mon–Sat, 9am–7pm IST\n📍 7, Mannady Street, George Town, Chennai — 600 001\n\nWe respond within **1 business day**. For urgent issues, mention "URGENT" in your email subject.`,
    followUps: ["Raise a support ticket", "How do I sign up?", "What is NavkarOS?"],
    supportLink: true,
  },
  {
    id: "icegate",
    keywords: ["icegate", "customs filing", "be filing", "e-sanchit", "igm", "pga", "fssai", "bis", "wpc", "icegate integration"],
    answer: `**ICEGATE Integration in EntryX:**\n\n✅ Full BE/SB preparation workflow connected to ICEGATE\n✅ e-Sanchit auto-upload (saves 15–20 min per document)\n✅ IGM linking for containers\n✅ PGA auto-trigger: FSSAI, BIS, WPC, Plant Quarantine based on HS code\n✅ Assessment status tracking\n✅ OOC date auto-recorded when granted\n\nEntryX validates BE before submission: GSTIN, IEC, ADD check, FTA COO check.`,
    followUps: ["EntryX features", "How much does it cost?", "Is there a free trial?"],
  },
  {
    id: "forwarder-bundle",
    keywords: ["forwarder bundle price", "nexlog accura", "forwarder combo"],
    answer: `**Forwarder Bundle** = Nexlog + Accura\n\n💰 ₹2,699/mo (saves ₹599/mo vs buying individually)\n\nPerfect for C&F Agents and Freight Forwarders who need:\n• Job management, BL/HAWB, vessel tracking (Nexlog)\n• GST invoicing, vouchers, bank reconciliation (Accura)\n\n14-day free trial included.`,
    followUps: ["Nexlog features", "Accura features", "Is there a free trial?"],
  },
];

// ─── Matching Engine ──────────────────────────────────────────────────────────

function findAnswer(input: string): BotEntry {
  const q = input.toLowerCase().trim();

  let best: BotEntry | null = null;
  let bestScore = 0;

  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q === kw) { score += 100; break; } // exact match
      if (q.includes(kw)) score += kw.split(" ").length * 3;
      else {
        const words = kw.split(" ").filter(w => w.length > 3);
        const matches = words.filter(w => q.includes(w));
        score += matches.length;
      }
    }
    if (score > bestScore) { bestScore = score; best = entry; }
  }

  if (!best || bestScore === 0) {
    return {
      id: "fallback",
      keywords: [],
      answer: `I'm not sure about that. Let me connect you with our team:\n\n📧 **navkaros.co@gmail.com**\n📞 **+91 90807 67398** (Mon–Sat, 9am–7pm)\n\nOr try one of these common questions:`,
      followUps: ["What is NavkarOS?", "How much does it cost?", "Which product is right for me?"],
      supportLink: true,
    };
  }

  return best;
}

// ─── Starters ─────────────────────────────────────────────────────────────────

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
  supportLink?: boolean;
}

// ─── Render markdown-lite ─────────────────────────────────────────────────────

function renderContent(text: string) {
  return text.split("\n").map((line, i, arr) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((p, j) =>
      j % 2 === 1 ? <strong key={j} style={{ color: "#D4AF37" }}>{p}</strong> : p
    );
    return <span key={i}>{rendered}{i < arr.length - 1 && <br />}</span>;
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 180); setHasOpened(true); }
  }, [open]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const entry = findAnswer(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: entry.answer,
        followUps: entry.followUps,
        supportLink: entry.supportLink,
      };
      setMessages(prev => [...prev, botMsg]);
      setThinking(false);
    }, 400 + Math.random() * 500);
  }, [thinking]);

  return (
    <>
      {/* ── Float button ─────────────────────────── */}
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
              initial={{ opacity: 0, x: 10, scale: 0.92 }} animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.92 }} transition={{ delay: 1.8, duration: 0.3 }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md whitespace-nowrap"
              style={{ background: "#1a1c1c", border: "1px solid rgba(212,175,55,0.2)" }}
            >
              Ask NavkarBot ✦
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setOpen(v => !v)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{ background: open ? "#1a1c1c" : "#D4AF37" }}
          aria-label="Open NavkarBot" type="button"
        >
          <AnimatePresence mode="wait">
            {open
              ? <motion.span key="c" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><Minimize2 className="h-5 w-5 text-[#D4AF37]" /></motion.span>
              : <motion.span key="o" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Bot className="h-6 w-6 text-[#1a1c1c]" /></motion.span>
            }
          </AnimatePresence>
        </button>
      </div>

      {/* ── Chat panel ───────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{ width: "min(380px, calc(100vw - 2rem))", height: "560px", background: "#fff", border: "1.5px solid rgba(212,175,55,0.25)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: "#1a1c1c", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}>
                <Bot className="h-4 w-4" style={{ color: "#D4AF37" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold leading-tight">NavkarBot</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Always online · Instant answers</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10">
                <X className="h-4 w-4" style={{ color: "rgba(255,255,255,0.45)" }} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ background: "#f9f9f9" }}>
              {messages.length === 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2.5 items-start">
                    <BotAvatar />
                    <Bubble role="assistant">
                      👋 Hi! I&apos;m <strong style={{ color: "#D4AF37" }}>NavkarBot</strong>. I can answer anything about NavkarOS — products, pricing, features, and more. What would you like to know?
                    </Bubble>
                  </div>
                  <div className="flex flex-col gap-1.5 pl-9">
                    {STARTERS.map(s => <Chip key={s} text={s} onClick={() => sendMessage(s)} disabled={thinking} />)}
                  </div>
                </div>
              )}

              {messages.map(m => (
                <div key={m.id}>
                  <div className={`flex gap-2.5 items-start ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    {m.role === "assistant" && <BotAvatar />}
                    <Bubble role={m.role}>{m.role === "assistant" ? renderContent(m.content) : m.content}</Bubble>
                  </div>
                  {m.role === "assistant" && (
                    <div className="flex flex-col gap-1.5 pl-9 mt-2">
                      {m.followUps?.map(f => <Chip key={f} text={f} onClick={() => sendMessage(f)} disabled={thinking} />)}
                      {m.supportLink && (
                        <Link
                          href="/dashboard/client/tickets"
                          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border font-semibold transition-all"
                          style={{ background: "rgba(212,175,55,0.08)", borderColor: "rgba(212,175,55,0.3)", color: "#92660a" }}
                        >
                          <HeadphonesIcon className="h-3.5 w-3.5" />
                          Raise a Support Ticket →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {thinking && (
                <div className="flex gap-2.5 items-start">
                  <BotAvatar />
                  <Bubble role="assistant"><TypingDots /></Bubble>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2 px-3 py-3 flex-shrink-0 border-t" style={{ background: "#fff", borderColor: "rgba(212,175,55,0.12)" }}>
              <input
                ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask anything about NavkarOS..."
                disabled={thinking}
                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl outline-none disabled:opacity-60"
                style={{ background: "#f9f9f9", border: "1.5px solid #e5e7eb", color: "#1a1c1c" }}
                onFocus={e => (e.target.style.borderColor = "rgba(212,175,55,0.5)")}
                onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button type="submit" disabled={thinking || !input.trim()} className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40" style={{ background: "#D4AF37" }}>
                <Send className="h-4 w-4 text-[#1a1c1c]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

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
    <div className="text-sm leading-relaxed px-3.5 py-2.5" style={{
      maxWidth: "85%", whiteSpace: "pre-wrap", wordBreak: "break-word",
      background: isUser ? "#D4AF37" : "#1a1c1c",
      color: isUser ? "#1a1c1c" : "rgba(255,255,255,0.88)",
      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
      fontWeight: isUser ? 600 : 400,
    }}>
      {children}
    </div>
  );
}

function Chip({ text, onClick, disabled }: { text: string; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} type="button"
      className="text-left text-xs px-3 py-2 rounded-xl border font-medium disabled:opacity-50 transition-all duration-150"
      style={{ background: "#fff", borderColor: "#e5e7eb", color: "#4b5563" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#D4AF37"; (e.currentTarget as HTMLElement).style.color = "#1a1c1c"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.color = "#4b5563"; }}
    >
      {text}
    </button>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map(i => (
        <motion.span key={i} className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#D4AF37" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }} />
      ))}
    </span>
  );
}
