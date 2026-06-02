export const MODULE_LIST = [
  {
    id: "nexlog",
    name: "Nexlog",
    tagline: "Freight Forwarding",
    desc: "Full shipment lifecycle from booking to delivery. AI reads BLs and AWBs, GST invoicing in 3 clicks.",
    color: "#1565C0",
    plans: ["starter", "growth", "pro"],
  },
  {
    id: "entryx",
    name: "EntryX",
    tagline: "Customs Clearance",
    desc: "End-to-end customs clearance. BE preparation, ICEGATE filing, duty auto-calculation with live CBIC tariff.",
    color: "#5B21B6",
    plans: ["starter", "growth", "pro"],
  },
  {
    id: "dockiq",
    name: "DockIQ",
    tagline: "CFS & Warehouse",
    desc: "Container gate-in to delivery. Examination tracking, storage slab billing, CFS invoice generation.",
    color: "#0D7057",
    plans: ["starter", "growth", "pro"],
  },
  {
    id: "rundesk",
    name: "RunDesk",
    tagline: "Transport & Fleet",
    desc: "LR generation, trip management, GPS tracking via driver app, vehicle compliance, and GST freight invoicing.",
    color: "#92400E",
    plans: ["growth", "pro"],
  },
  {
    id: "accura",
    name: "Accura",
    tagline: "Freight Accounting",
    desc: "Auto-posts income from every product. GSTR-1 & GSTR-3B ready, P&L in 3 seconds, Tally XML export.",
    color: "#1A237E",
    plans: ["growth", "pro"],
  },
  {
    id: "tradepilot",
    name: "TradePilot",
    tagline: "Importers & Exporters",
    desc: "Landed cost calculator, HSN Scout, FTA checker, RoDTEP tracker, document vault, shipment register.",
    color: "#004D40",
    plans: ["pro"],
  },
] as const;

export type ModuleId = typeof MODULE_LIST[number]["id"];

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 999,
    modules: ["nexlog", "entryx", "dockiq"] as ModuleId[],
    features: ["Nexlog", "EntryX", "DockIQ", "Up to 100 jobs/mo", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 2499,
    modules: ["nexlog", "entryx", "dockiq", "rundesk", "accura"] as ModuleId[],
    features: ["All Starter modules", "RunDesk", "Accura", "Unlimited jobs", "Priority support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 4999,
    modules: ["nexlog", "entryx", "dockiq", "rundesk", "accura", "tradepilot"] as ModuleId[],
    features: ["All 6 products", "TradePilot", "Tally XML sync", "Dedicated account manager", "SLA guarantee"],
  },
] as const;

export type PlanId = typeof PLANS[number]["id"];

export function getModuleById(id: string) {
  return MODULE_LIST.find((m) => m.id === id);
}
