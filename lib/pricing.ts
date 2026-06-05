export const PRICING = {
  nexlog: {
    id: "nexlog",
    name: "Nexlog",
    tagline: "Freight Forwarding Operations",
    color: "#1565C0",
    icon: "navigation",
    desc: "End-to-end job management for C&F agents and freight forwarders — booking, BL, tracking, and invoicing.",
    forTypes: ["CF_AGENT", "FREIGHT_FORWARDER"],
    starter: 1649,
    pro: 2449,
    starterFeatures: ["Up to 100 jobs/month", "BL & MBL management", "Basic shipment tracking", "Client portal", "Email notifications", "1 branch"],
    proFeatures: ["Unlimited jobs", "AI document extraction", "Live vessel tracking", "Multi-branch", "Tally export", "Priority support", "Custom reports"],
  },
  entryx: {
    id: "entryx",
    name: "EntryX",
    tagline: "Customs Clearance",
    color: "#5B21B6",
    icon: "gavel",
    desc: "AI-powered Bill of Entry preparation, ICEGATE filing, duty calculation, and HS code verification for licensed CHAs.",
    forTypes: ["CHA"],
    starter: 1649,
    pro: 2449,
    starterFeatures: ["Up to 50 BEs/month", "Manual BE preparation", "Basic duty calc", "Document store", "ICEGATE filing"],
    proFeatures: ["Unlimited BEs", "AI BE preparation", "Auto HS code detection", "IGST split calc", "Duty drawback tracking", "ICEGATE auto-sync", "Custom workflows"],
  },
  dockiq: {
    id: "dockiq",
    name: "DockIQ",
    tagline: "CFS & Warehouse Management",
    color: "#0D7057",
    icon: "warehouse",
    desc: "Complete CFS station management — gate-in/out, yard planning, storage billing, and importer notifications.",
    forTypes: ["CFS_WAREHOUSE"],
    starter: 2049,
    pro: 3299,
    starterFeatures: ["Up to 500 containers/month", "Gate-in/out log", "Manual storage billing", "Bay management", "Importer notifications"],
    proFeatures: ["Unlimited containers", "Auto storage slab billing", "Mobile gate app", "Yard 3D view", "Auto invoice generation", "WhatsApp notifications", "Custom reports"],
  },
  rundesk: {
    id: "rundesk",
    name: "RunDesk",
    tagline: "Transport Management",
    color: "#92400E",
    icon: "local_shipping",
    desc: "LR issuance, fleet tracking, e-way bill generation, and GST invoice creation for transporters and fleet operators.",
    forTypes: ["TRANSPORTER"],
    starter: 1249,
    pro: 1899,
    starterFeatures: ["Up to 200 LRs/month", "Basic LR management", "Manual e-way bill", "GST invoice", "Driver management"],
    proFeatures: ["Unlimited LRs", "GPS live tracking", "Auto e-way bill", "Auto GST invoice", "Fleet analytics", "Mobile driver app", "Fuel log"],
  },
  accura: {
    id: "accura",
    name: "Accura",
    tagline: "Freight Accounting",
    color: "#1A237E",
    icon: "account_balance",
    desc: "Complete freight accounting with auto GSTR-1, GSTR-3B export, multi-currency, and Tally sync built for logistics.",
    forTypes: ["CF_AGENT", "CHA", "CFS_WAREHOUSE", "TRANSPORTER", "FREIGHT_FORWARDER"],
    starter: 1249,
    pro: 1899,
    starterFeatures: ["Up to 50 invoices/month", "Basic GST billing", "Manual GSTR-1", "Expense tracking", "PDF invoice"],
    proFeatures: ["Unlimited invoices", "Auto GSTR-1 & 3B", "Multi-currency", "Tally sync", "Profitability reports", "Outstanding tracker", "TDS/TCS support"],
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
    starter: 799,
    pro: 1249,
    starterFeatures: ["Basic landed cost calc", "Manual FTA check", "Shipment tracking", "Document store", "5 HS codes"],
    proFeatures: ["AI landed cost calc", "Auto FTA eligibility", "RoDTEP tracker", "CEPA compliance", "Unlimited HS codes", "Trade analytics", "Duty benefit alerts"],
  },
} as const;

export type ProductId = keyof typeof PRICING;

export const BUNDLES = {
  forwarder_bundle: {
    id: "forwarder_bundle",
    name: "Forwarder Bundle",
    desc: "For C&F Agents & Freight Forwarders",
    includes: ["nexlog", "accura"],
    monthly: 3699,
    forTypes: ["CF_AGENT", "FREIGHT_FORWARDER"],
  },
  cha_bundle: {
    id: "cha_bundle",
    name: "CHA Bundle",
    desc: "For Custom House Agents",
    includes: ["entryx", "accura"],
    monthly: 3699,
    forTypes: ["CHA"],
  },
  cfs_bundle: {
    id: "cfs_bundle",
    name: "CFS Bundle",
    desc: "For CFS Stations & Warehouses",
    includes: ["dockiq", "accura"],
    monthly: 4499,
    forTypes: ["CFS_WAREHOUSE"],
  },
  transporter_bundle: {
    id: "transporter_bundle",
    name: "Transporter Bundle",
    desc: "For Transporters & Fleet Operators",
    includes: ["rundesk", "accura"],
    monthly: 3099,
    forTypes: ["TRANSPORTER"],
  },
  full_suite: {
    id: "full_suite",
    name: "Full Suite",
    desc: "All 6 products — complete logistics OS",
    includes: ["nexlog", "entryx", "dockiq", "rundesk", "accura", "tradepilot"],
    monthly: 10699,
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
