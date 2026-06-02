// ─── The Command Suite ────────────────────────────────────────────
export const suite = [
  {
    id: "freightops",
    name: "FreightOps",
    tagline: "Core Shipment Command",
    desc: "End-to-end shipment lifecycle for sea, air, and surface. Every job gets a unique number linking all documents, charges, partners, and status updates in one record.",
    icon: "navigation",
  },
  {
    id: "docai",
    name: "DocAI",
    tagline: "Zero-Entry Intelligence",
    desc: "AI reads BL, AWB, Bill of Entry, CFS invoices in seconds. Pre-trained on Indian logistics formats — ICEGATE, Hapag-Lloyd India, Apollo World Connect, Sanco Trans.",
    icon: "psychology",
  },
  {
    id: "billgen",
    name: "BillGen",
    tagline: "GST-Native Invoicing",
    desc: "Generate GST-compliant invoices in 3 clicks. Auto-splits CGST/SGST vs IGST, fills SAC codes, calculates Indian number-to-words. Sends via WhatsApp instantly.",
    icon: "payments",
  },
  {
    id: "clienthub",
    name: "ClientHub",
    tagline: "White-Label Client Portal",
    desc: "White-labeled customer portal for a professional shipper experience. Every client tracks cargo, downloads documents, views invoices, and raises queries without calling you.",
    icon: "groups",
  },
  {
    id: "accountsos",
    name: "AccountsOS",
    tagline: "Freight-Native Accounting",
    desc: "Double-entry accounting built around freight job numbers. GSTR-1 & GSTR-3B export ready. Tally XML for CA handoff. P&L without bookkeeping knowledge.",
    icon: "account_balance_wallet",
  },
  {
    id: "ratedesk",
    name: "RateDesk",
    tagline: "Dynamic Rate Management",
    desc: "Store negotiated rates with shipping lines, CFS stations, and transporters. Build client quotes in under 60 seconds. Accepted quotes convert to shipments automatically.",
    icon: "monitoring",
  },
  {
    id: "connectlayer",
    name: "ConnectLayer",
    tagline: "Native Integrations",
    desc: "Native connectivity to ICEGATE, GSTN, WhatsApp Business API, Razorpay, MarineTraffic, Tally, and major Indian ERPs.",
    icon: "settings_input_component",
  },
];

// ─── Problems ────────────────────────────────────────────────────
export const problems = [
  {
    icon: "chat_bubble",
    title: "WhatsApp Chaos",
    desc: "Critical shipment updates, document links, and instructions buried in thousands of unread group messages.",
  },
  {
    icon: "table_chart",
    title: "Excel Dependency",
    desc: "Version errors and broken formulas leading to costly billing mistakes and missed deadlines.",
  },
  {
    icon: "receipt_long",
    title: "Tally Friction",
    desc: "Manual data entry from delivery orders into Tally takes hours every day — for every single job.",
  },
  {
    icon: "history",
    title: "Delayed Rates",
    desc: "Missing market opportunities because freight rates aren't centralized and expire unnoticed.",
  },
  {
    icon: "inventory_2",
    title: "Document Hunt",
    desc: "Spending 20% of your time searching for missing Bills of Lading, invoices, or gate passes.",
  },
  {
    icon: "dangerous",
    title: "Payment Leakage",
    desc: "Unrecorded detention and demurrage charges silently eating into your margins every month.",
  },
];

// ─── Workflow steps ───────────────────────────────────────────────
export const workflow = [
  {
    step: "01",
    title: "Create Job",
    desc: "Input master shipment details or import from client delivery order. Auto-generates job number.",
  },
  {
    step: "02",
    title: "Manage Docs",
    desc: "DocAI reads and stores all trade documents — BL, AWB, invoices, BE — in under 3 seconds each.",
  },
  {
    step: "03",
    title: "Track & Alert",
    desc: "Auto-updates sent to clients via Email and WhatsApp at every stage of the 11-step status timeline.",
  },
  {
    step: "04",
    title: "Settle Accounts",
    desc: "Generate GST invoices, reconcile expenses, and sync with Tally for seamless ledger closing.",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────
export const testimonials = [
  {
    id: 1,
    quote: "NavkarOS reduced our documentation errors by 90% in the first month. Our CHA team now clears double the shipments with the same headcount.",
    name: "Rahul Mehta",
    role: "Director",
    company: "BlueOcean Logistics, Mumbai",
    initials: "RM",
  },
  {
    id: 2,
    quote: "The Tally integration is a game-changer. We no longer spend nights matching vouchers. Everything is automated and our CA gets a clean XML every quarter.",
    name: "Ananya Singh",
    role: "Founder",
    company: "TradeSwift India, Chennai",
    initials: "AS",
  },
  {
    id: 3,
    quote: "Our clients love the tracking portal. It gives us a professional edge over much larger freight forwarders. Importers stopped calling for updates entirely.",
    name: "Vikram Iyer",
    role: "Operations Lead",
    company: "GlobalLink CHA, Kochi",
    initials: "VI",
  },
  {
    id: 4,
    quote: "We handle 80+ live shipments at any time. NavkarOS lets our 3-person ops team manage what used to need 7 people. The ROI was clear by week two.",
    name: "Mohammed Farouk",
    role: "MD",
    company: "Gulf Link Shipping, Nhava Sheva",
    initials: "MF",
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────
export const faqs = [
  {
    q: "How secure is our shipment data?",
    a: "We use enterprise-grade 256-bit encryption. Your data is stored in AWS Mumbai servers, ensuring low latency and full compliance with Indian data sovereignty laws.",
  },
  {
    q: "Do you support LCL, FCL, Air Freight, and Breakbulk?",
    a: "Yes. NavkarOS supports Air Freight, LCL, FCL, and Breakbulk. Each shipment type has its own customized job workflow, document set, and charge structure.",
  },
  {
    q: "Can I migrate my old data from Excel or Tally?",
    a: "Absolutely. We provide one-click CSV/Excel import tools, and our onboarding team personally helps you map historical data seamlessly in the first week.",
  },
  {
    q: "Does DocAI work on scanned documents and mobile photos?",
    a: "Yes. DocAI uses vision AI that handles PDFs, scanned images, and even photos taken on a mobile phone. Accuracy is 98%+ on supported Indian logistics document formats.",
  },
  {
    q: "Is the ClientHub truly white-labeled?",
    a: "On the Pro plan and above, ClientHub runs on your own domain with your logo, brand colors, and company name. Your clients never see NavkarOS branding.",
  },
];

// ─── Pricing ──────────────────────────────────────────────────────
export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    badge: null,
    monthly: 999,
    annual: 9990,
    desc: "For solo C&F agents getting started.",
    features: [
      "1 user seat",
      "Up to 15 jobs/month",
      "FreightOps core module",
      "BillGen — GST invoices",
      "ClientHub (5 clients)",
      "Basic GST accounting",
      "Email support",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth",
    badge: "Most Popular",
    monthly: 2499,
    annual: 24990,
    desc: "For growing freight teams.",
    features: [
      "3 user seats",
      "Unlimited jobs",
      "Everything in Starter",
      "DocAI — AI doc extraction",
      "RateDesk — instant quoting",
      "WhatsApp auto-notifications",
      "Tally XML export",
      "Receivables & payables",
    ],
    cta: "Select Growth",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    badge: null,
    monthly: 4999,
    annual: 49990,
    desc: "For large freight forwarding companies.",
    features: [
      "10 user seats",
      "Unlimited everything",
      "Everything in Growth",
      "White-label ClientHub",
      "GSTR-1 & GSTR-3B export",
      "API access & webhooks",
      "Dedicated account manager",
      "Priority phone support",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

// ─── Partners ticker ──────────────────────────────────────────────
export const partners = [
  "MAERSK", "HAPAG-LLOYD", "CMA CGM", "MSC",
  "ADANI PORTS", "DP WORLD", "DHL GLOBAL",
  "APOLLO WORLD CONNECT", "SANCO TRANS",
  "ICEGATE", "TALLY PRIME", "RAZORPAY",
];

// ─── Stats ────────────────────────────────────────────────────────
export const stats = [
  { id: "biz", value: 500, suffix: "+", label: "Active Businesses", sub: "Across India" },
  { id: "jobs", value: 12000, suffix: "+", label: "Jobs/Month", sub: "On platform" },
  { id: "accuracy", value: 98, suffix: "%", label: "DocAI Accuracy", sub: "Indian doc formats" },
  { id: "saving", value: 14, suffix: "hrs", label: "Saved Per Week", sub: "Per ops team" },
];

// ─── Stakeholders ─────────────────────────────────────────────────
export const stakeholders = [
  {
    id: "cf",
    title: "C&F Agents & Freight Forwarders",
    desc: "Replace Excel, WhatsApp chaos, and disconnected tools with one login. Every job, invoice, and document in a system built for Indian freight.",
    icon: "🏢",
    tags: ["FreightOps", "BillGen", "AccountsOS"],
    dark: true,
  },
  {
    id: "cha",
    title: "Custom House Agents (CHA)",
    desc: "DocAI reads Bills of Entry, Gatepass OOC, and duty receipts in seconds. BE number, exam type, assess value — extracted and linked instantly.",
    icon: "⚖️",
    tags: ["DocAI", "ConnectLayer"],
    dark: false,
  },
  {
    id: "transporter",
    title: "Transporters",
    desc: "Manage trip assignments, e-way bills, and delivery confirmations per job. Transport invoices auto-matched against recorded charges.",
    icon: "🚛",
    tags: ["FreightOps", "BillGen"],
    dark: false,
  },
  {
    id: "exporter",
    title: "Exporters & Importers",
    desc: "ClientHub gives your importers and exporters real-time cargo visibility, document downloads, and invoice access — no more status calls.",
    icon: "📦",
    tags: ["ClientHub", "FreightOps"],
    dark: false,
  },
  {
    id: "cfs",
    title: "CFS & ICD Operators",
    desc: "CFS handling charges, storage rates, and free-day calculations built-in. Invoices from Apollo, Sanco matched automatically.",
    icon: "🏗️",
    tags: ["AccountsOS", "DocAI"],
    dark: false,
  },
];
