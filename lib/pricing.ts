export const PRICING = {
  nexlog: {
    id: "nexlog",
    name: "Nexlog",
    tagline: "Freight Forwarding Operations",
    color: "#1565C0",
    icon: "navigation",
    desc: "End-to-end job management for C&F agents and freight forwarders — booking, BL, tracking, and invoicing.",
    forTypes: ["CF_AGENT", "FREIGHT_FORWARDER"],
    price: 1799,
    features: [
      "Unlimited job management",
      "BL & MBL handling",
      "AI document extraction",
      "Live vessel tracking",
      "GST invoicing in 3 clicks",
      "Tally XML export",
      "Multi-branch support",
      "Client portal",
      "WhatsApp notifications",
    ],
  },
  entryx: {
    id: "entryx",
    name: "EntryX",
    tagline: "Customs Clearance",
    color: "#5B21B6",
    icon: "gavel",
    desc: "AI-powered Bill of Entry preparation, ICEGATE filing, duty calculation, and HS code verification for licensed CHAs.",
    forTypes: ["CHA"],
    price: 1899,
    features: [
      "Unlimited Bills of Entry",
      "AI BE preparation",
      "ICEGATE auto-sync",
      "Live CBIC tariff",
      "Automatic HS code detection",
      "IGST split calculation",
      "Duty drawback tracking",
      "Custom workflows",
      "Document store",
    ],
  },
  dockiq: {
    id: "dockiq",
    name: "DockIQ",
    tagline: "CFS & Warehouse Management",
    color: "#0D7057",
    icon: "warehouse",
    desc: "Complete CFS station management — gate-in/out, yard planning, storage billing, and importer notifications.",
    forTypes: ["CFS_WAREHOUSE"],
    price: 1599,
    features: [
      "Unlimited container handling",
      "Gate-in/out log",
      "Auto storage slab billing",
      "Yard 3D view",
      "Mobile gate app",
      "Auto invoice generation",
      "WhatsApp notifications",
      "Importer portal",
      "Custom reports",
    ],
  },
  rundesk: {
    id: "rundesk",
    name: "RunDesk",
    tagline: "Transport Management",
    color: "#92400E",
    icon: "local_shipping",
    desc: "LR issuance, fleet tracking, e-way bill generation, and GST invoice creation for transporters and fleet operators.",
    forTypes: ["TRANSPORTER"],
    price: 1399,
    features: [
      "Unlimited LRs & builty",
      "Trip management",
      "GPS via driver app",
      "Auto e-way bill",
      "GST freight invoicing",
      "Fleet analytics",
      "Mobile driver app",
      "Fuel log",
    ],
  },
  accura: {
    id: "accura",
    name: "Accura",
    tagline: "Freight Accounting",
    color: "#1A237E",
    icon: "account_balance",
    desc: "Complete freight accounting with auto GSTR-1, GSTR-3B export, multi-currency, and Tally sync built for logistics.",
    forTypes: ["CF_AGENT", "CHA", "CFS_WAREHOUSE", "TRANSPORTER", "FREIGHT_FORWARDER"],
    price: 1499,
    features: [
      "Unlimited invoices",
      "Auto GSTR-1 & GSTR-3B",
      "Multi-currency support",
      "Tally XML sync",
      "P&L in 3 seconds",
      "Per-job profitability",
      "Outstanding tracker",
      "TDS/TCS support",
      "Expense tracking",
    ],
    comparison: "vs Tally Silver ₹1,500/mo — knows nothing about freight. Accura is built for logistics.",
  },
  tradepilot: {
    id: "tradepilot",
    name: "TradePilot",
    tagline: "Import/Export Intelligence",
    color: "#004D40",
    icon: "public",
    desc: "Landed cost calculation, FTA eligibility, RoDTEP tracking, and import/export compliance dashboard for traders.",
    forTypes: ["IMPORTER_EXPORTER"],
    price: 1699,
    features: [
      "AI landed cost calculator",
      "Auto FTA eligibility check",
      "RoDTEP tracker",
      "CEPA compliance",
      "Unlimited HS codes",
      "Trade analytics",
      "Duty benefit alerts",
      "Document vault",
      "Multi-agent shipments",
    ],
  },
} as const;

export type ProductId = keyof typeof PRICING;

export const BUNDLES = {
  forwarder_bundle: {
    id: "forwarder_bundle",
    name: "Forwarder Bundle",
    desc: "For C&F Agents & Freight Forwarders",
    includes: ["nexlog", "accura"],
    monthly: 2699,
    forTypes: ["CF_AGENT", "FREIGHT_FORWARDER"],
  },
  cha_bundle: {
    id: "cha_bundle",
    name: "CHA Bundle",
    desc: "For Custom House Agents",
    includes: ["entryx", "accura"],
    monthly: 2799,
    forTypes: ["CHA"],
  },
  cfs_bundle: {
    id: "cfs_bundle",
    name: "CFS Bundle",
    desc: "For CFS Stations & Warehouses",
    includes: ["dockiq", "accura"],
    monthly: 2499,
    forTypes: ["CFS_WAREHOUSE"],
  },
  transporter_bundle: {
    id: "transporter_bundle",
    name: "Transporter Bundle",
    desc: "For Transporters & Fleet Operators",
    includes: ["rundesk", "accura"],
    monthly: 2299,
    forTypes: ["TRANSPORTER"],
  },
  full_suite: {
    id: "full_suite",
    name: "Full Suite",
    desc: "All 6 products — complete logistics OS",
    includes: ["nexlog", "entryx", "dockiq", "rundesk", "accura", "tradepilot"],
    monthly: 7499,
    forTypes: [] as string[],
  },
} as const;

export function getPrice(monthly: number, cycle: "monthly" | "quarterly" | "yearly"): number {
  if (cycle === "quarterly") return Math.round(monthly * 3 * 0.9);
  if (cycle === "yearly") return Math.round(monthly * 12 * 0.8);
  return monthly;
}

export function getMonthlyEquiv(monthly: number, cycle: "monthly" | "quarterly" | "yearly"): number {
  if (cycle === "quarterly") return Math.round(monthly * 0.9);
  if (cycle === "yearly") return Math.round(monthly * 0.8);
  return monthly;
}

export function getSavings(monthly: number, cycle: "monthly" | "quarterly" | "yearly"): number {
  if (cycle === "quarterly") return Math.round(monthly * 3 * 0.1);
  if (cycle === "yearly") return Math.round(monthly * 12 * 0.2);
  return 0;
}
