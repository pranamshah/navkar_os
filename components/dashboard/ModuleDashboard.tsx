"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ModuleId } from "@/lib/modules";

const dashboardContent: Record<ModuleId, React.ReactNode> = {
  nexlog: <FreightOpsDash />,
  entryx: <DocAIDash />,
  dockiq: <ClientHubDash />,
  rundesk: <RateDeskDash />,
  accura: <AccountsOSDash />,
  tradepilot: <ConnectLayerDash />,
};

export function ModuleDashboard({ moduleId }: { moduleId: ModuleId }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 lg:p-10"
    >
      {dashboardContent[moduleId]}
    </motion.div>
  );
}

const jobs: { id: string; client: string; route: string; mode: string; status: string; date: string; color: string }[] = [];

function DashHeader({ title, badge, action }: { title: string; badge?: string; action?: { label: string; href: string } }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "32px", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {badge && <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>{badge}</span>}
      </div>
      {action && (
        <Link href={action.href} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-widest" style={{ background: "#1a1c1c", color: "#fff" }}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

function StatCard({ val, label, sub }: { val: string; label: string; sub?: string }) {
  return (
    <div className="p-6" style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
      <p className="text-3xl font-semibold mb-1" style={{ color: "#1a1c1c", letterSpacing: "-0.02em" }}>{val}</p>
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "#D4AF37" }}>{sub}</p>}
    </div>
  );
}

function FreightOpsDash() {
  return (
    <div>
      <DashHeader title="FreightOps" badge="Core Shipment Command" action={{ label: "+ New Job", href: "#" }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="0" label="Active Jobs" />
        <StatCard val="0" label="At Customs" />
        <StatCard val="0" label="OOC Today" />
        <StatCard val="₹0" label="Charges This Month" />
      </div>
      <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>All Jobs</p>
          <div className="flex gap-2">
            {["All", "Active", "Customs", "Delivered"].map((f) => (
              <button key={f} className="text-xs px-3 py-1 transition-all cursor-none" style={{ background: f === "All" ? "#1a1c1c" : "transparent", color: f === "All" ? "#fff" : "#7e7576" }}>{f}</button>
            ))}
          </div>
        </div>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
              {["Job No.", "Client", "Route", "Mode", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-6 py-3 font-semibold uppercase tracking-wider" style={{ color: "#7e7576" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>inbox</span>
                    <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No jobs yet</p>
                    <p className="text-xs mt-1" style={{ color: "#7e7576" }}>They will appear here once added.</p>
                  </div>
                </td>
              </tr>
            ) : jobs.map((j, i) => (
              <tr key={j.id} style={{ borderBottom: "0.5px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                <td className="px-6 py-3 font-semibold" style={{ color: "#1a1c1c" }}>{j.id}</td>
                <td className="px-6 py-3" style={{ color: "#4c4546" }}>{j.client}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{j.route}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{j.mode}</td>
                <td className="px-6 py-3 font-semibold" style={{ color: j.color }}>{j.status}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{j.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocAIDash() {
  const docs = [
    { name: "BL_HAPL_0142.pdf", type: "Bill of Lading", job: "NOS/2026/0142", status: "Extracted", fields: 18, time: "2.4s", color: "#16A34A" },
    { name: "PLIST_0142.pdf", type: "Packing List", job: "NOS/2026/0142", status: "Extracted", fields: 12, time: "1.8s", color: "#16A34A" },
    { name: "BE_ICEGATE_0141.xml", type: "Bill of Entry", job: "NOS/2026/0141", status: "Extracted", fields: 24, time: "3.1s", color: "#16A34A" },
    { name: "CINV_EXP_0139.pdf", type: "Commercial Invoice", job: "NOS/2026/0139", status: "Reading", fields: "–", time: "●", color: "#D4AF37" },
  ];
  return (
    <div>
      <DashHeader title="DocAI" badge="Zero-Entry Intelligence" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="98.2%" label="Accuracy" sub="Last 30 days" />
        <StatCard val="3.1s" label="Avg. Extraction" />
        <StatCard val="284" label="Docs This Month" />
        <StatCard val="0" label="Manual Corrections" />
      </div>
      <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>Recent Documents</p>
        </div>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
              {["File", "Type", "Job", "Fields", "Time", "Status"].map((h) => (
                <th key={h} className="text-left px-6 py-3 font-semibold uppercase tracking-wider" style={{ color: "#7e7576" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.map((d, i) => (
              <tr key={d.name} style={{ borderBottom: "0.5px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                <td className="px-6 py-3 font-semibold" style={{ color: "#1a1c1c" }}>{d.name}</td>
                <td className="px-6 py-3" style={{ color: "#4c4546" }}>{d.type}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{d.job}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{d.fields}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{d.time}</td>
                <td className="px-6 py-3 font-semibold" style={{ color: d.color }}>{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BillGenDash() {
  const invoices = [
    { no: "INV-2026-0892", client: "Mehta Exports", amount: "₹1,11,336", gst: "IGST", status: "Sent", date: "28 May" },
    { no: "INV-2026-0891", client: "Patel Chemicals", amount: "₹88,200", gst: "IGST", status: "Paid", date: "26 May" },
    { no: "INV-2026-0890", client: "Krishna Textiles", amount: "₹32,400", gst: "CGST+SGST", status: "Draft", date: "24 May" },
    { no: "INV-2026-0889", client: "Rajvi Industries", amount: "₹67,800", gst: "IGST", status: "Sent", date: "20 May" },
  ];
  const statusColor: Record<string, string> = { Sent: "#3B82F6", Paid: "#16A34A", Draft: "#D4AF37" };
  return (
    <div>
      <DashHeader title="BillGen" badge="GST-Native Invoicing" action={{ label: "+ New Invoice", href: "#" }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="₹8.4L" label="Billed This Month" sub="14 invoices" />
        <StatCard val="₹5.2L" label="Collected" sub="62% recovery" />
        <StatCard val="3" label="Pending" />
        <StatCard val="0" label="GST Errors" />
      </div>
      <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>Invoices</p>
        </div>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
              {["Invoice No.", "Client", "Amount", "GST Type", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-6 py-3 font-semibold uppercase tracking-wider" style={{ color: "#7e7576" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={inv.no} style={{ borderBottom: "0.5px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                <td className="px-6 py-3 font-semibold" style={{ color: "#1a1c1c" }}>{inv.no}</td>
                <td className="px-6 py-3" style={{ color: "#4c4546" }}>{inv.client}</td>
                <td className="px-6 py-3 font-semibold" style={{ color: "#1a1c1c" }}>{inv.amount}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{inv.gst}</td>
                <td className="px-6 py-3 font-semibold" style={{ color: statusColor[inv.status] }}>{inv.status}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{inv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientHubDash() {
  const clients = [
    { name: "Mehta Exports", jobs: 4, portal: "Active", tracking: "2 live", lastSeen: "2 hrs ago" },
    { name: "Krishna Textiles", jobs: 2, portal: "Active", tracking: "1 live", lastSeen: "5 hrs ago" },
    { name: "Patel Chemicals", jobs: 1, portal: "Invite sent", tracking: "—", lastSeen: "—" },
    { name: "Rajvi Industries", jobs: 3, portal: "Active", tracking: "1 live", lastSeen: "Yesterday" },
  ];
  return (
    <div>
      <DashHeader title="ClientHub" badge="White-Label Client Portal" action={{ label: "+ Add Client", href: "#" }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="14" label="Active Clients" />
        <StatCard val="3" label="Tracking Now" sub="Live shipments" />
        <StatCard val="0" label="Support Calls" sub="vs 12 last month" />
        <StatCard val="98%" label="Portal Uptime" />
      </div>
      <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>Client Directory</p>
        </div>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
              {["Client", "Total Jobs", "Portal", "Live Tracking", "Last Active"].map((h) => (
                <th key={h} className="text-left px-6 py-3 font-semibold uppercase tracking-wider" style={{ color: "#7e7576" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((c, i) => (
              <tr key={c.name} style={{ borderBottom: "0.5px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                <td className="px-6 py-3 font-semibold" style={{ color: "#1a1c1c" }}>{c.name}</td>
                <td className="px-6 py-3" style={{ color: "#4c4546" }}>{c.jobs}</td>
                <td className="px-6 py-3 font-semibold" style={{ color: c.portal === "Active" ? "#16A34A" : "#D4AF37" }}>{c.portal}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{c.tracking}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{c.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AccountsOSDash() {
  return (
    <div>
      <DashHeader title="AccountsOS" badge="Freight-Native Accounting" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="₹8.4L" label="Revenue (June)" sub="+12% vs May" />
        <StatCard val="₹2.1L" label="Expenses" />
        <StatCard val="₹6.3L" label="Net Profit" sub="75% margin" />
        <StatCard val="Ready" label="GSTR-1 Export" sub="June 2026" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>P&L Summary</p>
          </div>
          <div className="p-6 space-y-4">
            {[
              { head: "Ocean Freight Revenue", amt: "₹6,20,000", type: "income" },
              { head: "Air Freight Revenue", amt: "₹1,40,000", type: "income" },
              { head: "Documentation Charges", amt: "₹80,000", type: "income" },
              { head: "CFS / THC Expenses", amt: "₹1,23,400", type: "expense" },
              { head: "Staff Salaries", amt: "₹84,000", type: "expense" },
              { head: "Office & Misc", amt: "₹18,000", type: "expense" },
            ].map((r) => (
              <div key={r.head} className="flex justify-between text-xs">
                <span style={{ color: "#4c4546" }}>{r.head}</span>
                <span className="font-semibold" style={{ color: r.type === "income" ? "#16A34A" : "#EF4444" }}>
                  {r.type === "expense" ? "−" : ""}{r.amt}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>GST Filings</p>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "GSTR-1 (June 2026)", status: "Ready to Export", color: "#16A34A" },
              { label: "GSTR-3B (June 2026)", status: "Pending", color: "#D4AF37" },
              { label: "Tally XML (June 2026)", status: "Generated", color: "#16A34A" },
              { label: "GSTR-1 (May 2026)", status: "Filed", color: "#7e7576" },
            ].map((g) => (
              <div key={g.label} className="flex justify-between items-center text-xs">
                <span style={{ color: "#4c4546" }}>{g.label}</span>
                <span className="font-semibold" style={{ color: g.color }}>{g.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RateDeskDash() {
  const rates = [
    { lane: "INNSA → DEHAM", carrier: "Hapag-Lloyd", teu: "$890", cbm: "₹4,200", valid: "30 Jun 2026", status: "Active" },
    { lane: "INMAA → SGSIN", carrier: "MSC", teu: "$320", cbm: "₹1,800", valid: "15 Jun 2026", status: "Expiring" },
    { lane: "INCCU → USLAX", carrier: "Evergreen", teu: "$1,240", cbm: "₹6,800", valid: "31 Jul 2026", status: "Active" },
    { lane: "INMUN → AEJEA", carrier: "CMA CGM", teu: "$460", cbm: "₹2,400", valid: "20 Jun 2026", status: "Active" },
  ];
  return (
    <div>
      <DashHeader title="RateDesk" badge="Dynamic Rate Management" action={{ label: "+ Add Rate", href: "#" }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="12" label="Active Rates" />
        <StatCard val="3" label="Expiring Soon" sub="Next 7 days" />
        <StatCard val="8" label="Quotes Sent" sub="This month" />
        <StatCard val="6" label="Quotes Converted" sub="75% hit rate" />
      </div>
      <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>Rate Cards</p>
        </div>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
              {["Trade Lane", "Carrier", "FCL/TEU", "LCL/CBM", "Valid Till", "Status"].map((h) => (
                <th key={h} className="text-left px-6 py-3 font-semibold uppercase tracking-wider" style={{ color: "#7e7576" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rates.map((r, i) => (
              <tr key={r.lane} style={{ borderBottom: "0.5px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                <td className="px-6 py-3 font-semibold" style={{ color: "#1a1c1c" }}>{r.lane}</td>
                <td className="px-6 py-3" style={{ color: "#4c4546" }}>{r.carrier}</td>
                <td className="px-6 py-3 font-semibold" style={{ color: "#1a1c1c" }}>{r.teu}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{r.cbm}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{r.valid}</td>
                <td className="px-6 py-3 font-semibold" style={{ color: r.status === "Active" ? "#16A34A" : "#D4AF37" }}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConnectLayerDash() {
  const integrations = [
    { name: "ICEGATE", type: "Customs EDI", status: "Connected", calls: "1,240/mo", lastSync: "2 min ago" },
    { name: "GSTN", type: "Tax API", status: "Connected", calls: "320/mo", lastSync: "1 hr ago" },
    { name: "WhatsApp Business API", type: "Notifications", status: "Connected", calls: "4,800/mo", lastSync: "Live" },
    { name: "MarineTraffic", type: "Vessel Tracking", status: "Connected", calls: "180/mo", lastSync: "5 min ago" },
    { name: "Razorpay", type: "Payment Links", status: "Connected", calls: "24/mo", lastSync: "Today" },
    { name: "Tally Prime", type: "Accounting Sync", status: "Connected", calls: "XML export", lastSync: "Manual" },
  ];
  return (
    <div>
      <DashHeader title="ConnectLayer" badge="Native Integrations" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="6/6" label="Integrations Live" />
        <StatCard val="99.9%" label="API Uptime" />
        <StatCard val="6.5k" label="API Calls / Month" />
        <StatCard val="0" label="Failed Calls" sub="Last 30 days" />
      </div>
      <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>Active Integrations</p>
        </div>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
              {["Service", "Type", "Status", "Usage", "Last Sync"].map((h) => (
                <th key={h} className="text-left px-6 py-3 font-semibold uppercase tracking-wider" style={{ color: "#7e7576" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {integrations.map((int, i) => (
              <tr key={int.name} style={{ borderBottom: "0.5px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                <td className="px-6 py-3 font-semibold" style={{ color: "#1a1c1c" }}>{int.name}</td>
                <td className="px-6 py-3" style={{ color: "#4c4546" }}>{int.type}</td>
                <td className="px-6 py-3 font-semibold" style={{ color: "#16A34A" }}>● {int.status}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{int.calls}</td>
                <td className="px-6 py-3" style={{ color: "#7e7576" }}>{int.lastSync}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
