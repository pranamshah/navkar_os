export const MODULE_LIST = [
  {
    id: "freightops",
    name: "FreightOps",
    tagline: "Core Shipment Command",
    desc: "End-to-end shipment lifecycle for sea, air, and surface. Every job gets a unique number.",
    color: "#1565C0",
    plans: ["starter", "growth", "pro"],
  },
  {
    id: "docai",
    name: "DocAI",
    tagline: "Zero-Entry Intelligence",
    desc: "AI reads BL, AWB, Bill of Entry, CFS invoices in seconds. Pre-trained on Indian formats.",
    color: "#7C3AED",
    plans: ["starter", "growth", "pro"],
  },
  {
    id: "billgen",
    name: "BillGen",
    tagline: "GST-Native Invoicing",
    desc: "Generate GST-compliant invoices in 3 clicks. Auto-splits CGST/SGST vs IGST.",
    color: "#1B5E20",
    plans: ["starter", "growth", "pro"],
  },
  {
    id: "clienthub",
    name: "ClientHub",
    tagline: "White-Label Client Portal",
    desc: "White-labeled portal where every client tracks cargo, downloads docs, raises queries.",
    color: "#E65100",
    plans: ["growth", "pro"],
  },
  {
    id: "accountsos",
    name: "AccountsOS",
    tagline: "Freight-Native Accounting",
    desc: "Double-entry accounting built around freight job numbers. GSTR-1 & GSTR-3B export ready.",
    color: "#1A237E",
    plans: ["growth", "pro"],
  },
  {
    id: "ratedesk",
    name: "RateDesk",
    tagline: "Dynamic Rate Management",
    desc: "Store negotiated rates with shipping lines. Build client quotes in under 60 seconds.",
    color: "#004D40",
    plans: ["growth", "pro"],
  },
  {
    id: "connectlayer",
    name: "ConnectLayer",
    tagline: "Native Integrations",
    desc: "Native connectivity to ICEGATE, GSTN, WhatsApp API, Razorpay, MarineTraffic, Tally.",
    color: "#37474F",
    plans: ["pro"],
  },
] as const;

export type ModuleId = typeof MODULE_LIST[number]["id"];

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 999,
    modules: ["freightops", "docai", "billgen"] as ModuleId[],
    features: ["FreightOps", "DocAI", "BillGen", "Up to 100 jobs/mo", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 2499,
    modules: ["freightops", "docai", "billgen", "clienthub", "accountsos", "ratedesk"] as ModuleId[],
    features: ["All Starter modules", "ClientHub", "AccountsOS", "RateDesk", "Unlimited jobs", "Priority support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 4999,
    modules: ["freightops", "docai", "billgen", "clienthub", "accountsos", "ratedesk", "connectlayer"] as ModuleId[],
    features: ["All 7 modules", "ConnectLayer APIs", "Tally XML sync", "Dedicated account manager", "SLA guarantee"],
  },
] as const;

export type PlanId = typeof PLANS[number]["id"];

export function getModuleById(id: string) {
  return MODULE_LIST.find((m) => m.id === id);
}
