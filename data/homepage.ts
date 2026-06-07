// ─── The 6 NavkarOS Products ──────────────────────────────────────
export const suite = [
  {
    id: "nexlog",
    name: "Nexlog",
    tagline: "Freight Forwarders & C&F Agents",
    desc: "Full shipment lifecycle from booking to delivery. AI reads BLs and AWBs, GST invoicing in 3 clicks, white-label client portal, and instant WhatsApp updates.",
    icon: "navigation",
    color: "#1565C0",
  },
  {
    id: "entryx",
    name: "EntryX",
    tagline: "Custom House Agents",
    desc: "End-to-end customs clearance. BE preparation, ICEGATE filing across all major ports, duty auto-calculation with live CBIC tariff, DGFT integration, and OOC alerts.",
    icon: "gavel",
    color: "#5B21B6",
  },
  {
    id: "dockiq",
    name: "DockIQ",
    tagline: "CFS Stations & Warehouses",
    desc: "Container gate-in to delivery. Examination tracking, storage slab billing, CFS invoice generation, and an importer portal showing real-time storage charges.",
    icon: "warehouse",
    color: "#0D7057",
  },
  {
    id: "rundesk",
    name: "RunDesk",
    tagline: "Transporters & Fleet Operators",
    desc: "LR generation, trip management, GPS tracking via driver app, vehicle compliance alerts, and GST freight invoicing — from single truck to full fleet.",
    icon: "local_shipping",
    color: "#92400E",
  },
  {
    id: "accura",
    name: "Accura",
    tagline: "All Freight Businesses",
    desc: "Freight-native accounting. Auto-posts income from every product, GSTR-1 & GSTR-3B ready, P&L in 3 seconds, Tally XML export, per-job profitability.",
    icon: "account_balance",
    color: "#1A237E",
  },
  {
    id: "tradepilot",
    name: "TradePilot",
    tagline: "Importers & Exporters",
    desc: "Full trade visibility. Landed cost calculator, HSN Scout, FTA checker, RoDTEP tracker, document vault, and multi-agent shipment management in one place.",
    icon: "public",
    color: "#004D40",
  },
];

// ─── Problems ────────────────────────────────────────────────────
export const problems = [
  {
    icon: "scatter_plot",
    title: "Six Systems, Zero Sync",
    desc: "A CFS, a CHA, a freight forwarder, a transporter, accounting, and WhatsApp — each disconnected, each duplicating the same data.",
  },
  {
    icon: "table_chart",
    title: "Excel Running Operations",
    desc: "Version errors, broken formulas, and no audit trail — running a multi-crore freight operation on spreadsheets is a liability waiting to happen.",
  },
  {
    icon: "visibility_off",
    title: "Importers in the Dark",
    desc: "Clients calling 40 times a day asking where their cargo is. No portal, no real-time status, no document access — just phone calls.",
  },
  {
    icon: "receipt_long",
    title: "GST is a Manual Job",
    desc: "CGST vs IGST, SAC codes, GSTR-1 data — all compiled by hand from multiple systems. CA gets raw data instead of a clean export.",
  },
  {
    icon: "gavel",
    title: "Customs Filing Errors",
    desc: "Manual BE data entry from Commercial Invoices and Packing Lists — one wrong HS code or duty rate and the entire consignment is held.",
  },
  {
    icon: "money_off",
    title: "Invisible Cost Leakage",
    desc: "Detention, demurrage, and storage charges accumulating silently because no system connects the CFS invoice to the freight job.",
  },
];

// ─── Workflow steps ───────────────────────────────────────────────
export const workflow = [
  {
    step: "01",
    title: "Job Created in Nexlog",
    desc: "Client inquiry comes in. Nexlog creates the job, assigns a unique number, and auto-notifies the client via WhatsApp.",
  },
  {
    step: "02",
    title: "EntryX Files Customs",
    desc: "CHA picks up the job reference, pre-fills BE form with AI-extracted invoice data, files on ICEGATE — zero re-entry.",
  },
  {
    step: "03",
    title: "DockIQ Tracks Cargo",
    desc: "CFS receives the container. Gate-in, examination status, destuffing, and storage charges flow automatically into the job.",
  },
  {
    step: "04",
    title: "Accura Closes the Books",
    desc: "Every charge from every product auto-posts to Accura. GSTR-1 ready. Job margin calculated. CA export in one click.",
  },
];

// ─── Partners ticker ──────────────────────────────────────────────
export const partners = [
  { name: "MAERSK", initials: "MSK", color: "#00243D" },
  { name: "HAPAG-LLOYD", initials: "HL", color: "#E2700A" },
  { name: "CMA CGM", initials: "CMA", color: "#003B7A" },
  { name: "MSC", initials: "MSC", color: "#0058A6" },
  { name: "ADANI PORTS", initials: "AP", color: "#1B4F9C" },
  { name: "JNPT", initials: "JN", color: "#1A6B3C" },
  { name: "ICEGATE", initials: "ICG", color: "#8B0000" },
  { name: "TALLY PRIME", initials: "TP", color: "#0052CC" },
  { name: "RAZORPAY", initials: "RZ", color: "#072654" },
  { name: "APOLLO WORLD CONNECT", initials: "AWC", color: "#2C4E8A" },
  { name: "SANCO TRANS", initials: "ST", color: "#3A5A40" },
  { name: "DHL GLOBAL", initials: "DHL", color: "#FFCC00" },
];

// ─── Stats ────────────────────────────────────────────────────────
export const stats = [
  { id: "saving", value: 14, suffix: "hrs", label: "Saved Per Week", sub: "Per operations team" },
  { id: "clicks", value: 3, suffix: " clicks", label: "To Generate GST Invoice", sub: "From any device" },
  { id: "accuracy", value: 98, suffix: "%", label: "AI Extraction Accuracy", sub: "On Indian doc formats" },
  { id: "ports", value: 16, suffix: "+", label: "Indian Ports Supported", sub: "JNPT to Vizag" },
];

// ─── Testimonials (not on homepage — kept for other pages) ───────
export const testimonials = [
  {
    id: 1,
    quote: "NavkarOS eliminated our manual BE filing errors completely. Our clearance rate improved in the first two weeks.",
    name: "Rakesh Joshi",
    role: "Proprietor",
    company: "Joshi CHA Services, JNPT",
    initials: "RJ",
  },
  {
    id: 2,
    quote: "The Accura accounting module replaced Tally for us. P&L in 3 seconds, GSTR-1 in one click. Our CA is happier than ever.",
    name: "Sunita Pillai",
    role: "Director",
    company: "Pillai Freight Solutions, Kochi",
    initials: "SP",
  },
  {
    id: 3,
    quote: "DockIQ transformed how we run our CFS. Importers self-check their storage charges now. Phone calls dropped by 80%.",
    name: "Arvind Menon",
    role: "Operations Manager",
    company: "Apollo World Connect, Chennai",
    initials: "AM",
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────
export const faqs = [
  {
    q: "Can I use just one product from the suite?",
    a: "Yes. Every NavkarOS product works as a standalone. Nexlog for freight forwarding, EntryX for customs, DockIQ for CFS, RunDesk for transport, Accura for accounting, TradePilot for importers — each works independently and connects to the rest when needed.",
  },
  {
    q: "How secure is our shipment and financial data?",
    a: "Enterprise-grade 256-bit encryption. Data stored on AWS Mumbai servers ensuring low latency and full compliance with Indian data sovereignty requirements.",
  },
  {
    q: "Does EntryX support ICEGATE filing for all Indian ports?",
    a: "Yes. EntryX supports ICEGATE EDI filing for all major Indian ports — JNPT, Chennai, Mundra, Kolkata, Cochin, Vizag, and Tuticorin. Every BE field is validated against the current customs tariff before submission.",
  },
  {
    q: "Can I migrate data from Excel or Tally?",
    a: "Absolutely. NavkarOS provides CSV/Excel import tools for all products. Accura generates Tally XML that your CA can import into TallyPrime in under a minute.",
  },
  {
    q: "What Indian compliance formats are supported?",
    a: "GSTR-1, GSTR-3B, Advance Licence, EPCG, RoDTEP, E-Way Bill, Shipping Bill for drawback — all built in. SAC codes, IGST/CGST/SGST auto-split, Indian number format (Crore/Lakh/Thousand), and CFS-format storage invoices.",
  },
];

// ─── Stakeholders ─────────────────────────────────────────────────
export const stakeholders = [
  {
    id: "cf",
    title: "C&F Agents & Freight Forwarders",
    desc: "Replace Excel, WhatsApp chaos, and disconnected tools with one login.",
    icon: "🏢",
    tags: ["Nexlog", "Accura"],
    dark: true,
  },
  {
    id: "cha",
    title: "Custom House Agents",
    desc: "AI reads Bills of Entry and automates ICEGATE filing.",
    icon: "⚖️",
    tags: ["EntryX"],
    dark: false,
  },
  {
    id: "cfs",
    title: "CFS & Warehouse Operators",
    desc: "Container tracking, storage billing, and importer portal.",
    icon: "🏗️",
    tags: ["DockIQ"],
    dark: false,
  },
  {
    id: "transporter",
    title: "Transporters",
    desc: "LR generation, GPS tracking, and freight invoicing.",
    icon: "🚛",
    tags: ["RunDesk"],
    dark: false,
  },
  {
    id: "exporter",
    title: "Importers & Exporters",
    desc: "Full trade visibility, landed cost, and document vault.",
    icon: "📦",
    tags: ["TradePilot"],
    dark: false,
  },
];

// ─── Pricing (kept for /pricing page only) ────────────────────────
export const pricingPlans = [
  {
    id: "nexlog",
    name: "Nexlog",
    badge: null,
    monthly: 1799,
    annual: 17270,
    desc: "C&F Agents & Freight Forwarders",
    features: ["Shipment job management", "AI document extraction", "GST invoicing", "Client portal", "WhatsApp alerts"],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    id: "entryx",
    name: "EntryX",
    badge: null,
    monthly: 1899,
    annual: 18230,
    desc: "Custom House Agents",
    features: ["BE & Shipping Bill prep", "ICEGATE EDI filing", "Duty auto-calculation", "DGFT integration", "Client portal"],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    id: "dockiq",
    name: "DockIQ",
    badge: null,
    monthly: 1599,
    annual: 15350,
    desc: "CFS Stations & Warehouses",
    features: ["Container gate-in/out", "Exam tracking", "Storage slab billing", "CFS invoicing", "Importer portal"],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    id: "rundesk",
    name: "RunDesk",
    badge: null,
    monthly: 1399,
    annual: 13430,
    desc: "Transporters & Fleet Operators",
    features: ["LR generation", "Trip management", "GPS via driver app", "Vehicle compliance", "GST freight billing"],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    id: "accura",
    name: "Accura",
    badge: null,
    monthly: 1499,
    annual: 14390,
    desc: "All Freight Businesses",
    features: ["Auto income posting", "GSTR-1 & GSTR-3B", "P&L statement", "Tally XML export", "Per-job profitability"],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    id: "tradepilot",
    name: "TradePilot",
    badge: null,
    monthly: 1699,
    annual: 16310,
    desc: "Importers & Exporters",
    features: ["Shipment register", "Landed cost calculator", "HSN Scout", "FTA checker", "Document vault"],
    cta: "Start Free Trial",
    highlight: false,
  },
];
