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
  const docs: { name: string; type: string; job: string; status: string; fields: number | string; time: string; color: string }[] = [];
  return (
    <div>
      <DashHeader title="DocAI" badge="Zero-Entry Intelligence" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="—" label="Accuracy" sub="No data yet" />
        <StatCard val="—" label="Avg. Extraction" />
        <StatCard val="0" label="Docs This Month" />
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
  const invoices: { no: string; client: string; amount: string; gst: string; status: string; date: string }[] = [];
  const statusColor: Record<string, string> = { Sent: "#3B82F6", Paid: "#16A34A", Draft: "#D4AF37" };
  return (
    <div>
      <DashHeader title="BillGen" badge="GST-Native Invoicing" action={{ label: "+ New Invoice", href: "#" }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="₹0" label="Billed This Month" />
        <StatCard val="₹0" label="Collected" />
        <StatCard val="0" label="Pending" />
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
  const clients: { name: string; jobs: number; portal: string; tracking: string; lastSeen: string }[] = [];
  return (
    <div>
      <DashHeader title="ClientHub" badge="White-Label Client Portal" action={{ label: "+ Add Client", href: "#" }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="0" label="Active Clients" />
        <StatCard val="0" label="Tracking Now" sub="Live shipments" />
        <StatCard val="0" label="Support Calls" />
        <StatCard val="—" label="Portal Uptime" />
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
        <StatCard val="₹0" label="Revenue (This Month)" />
        <StatCard val="₹0" label="Expenses" />
        <StatCard val="₹0" label="Net Profit" />
        <StatCard val="—" label="GSTR-1 Export" sub="No data yet" />
      </div>
      <div className="flex flex-col items-center justify-center py-16" style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
        <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No accounting data yet</p>
        <p className="text-xs mt-1" style={{ color: "#7e7576" }}>Add ledgers and vouchers in Accura to see your P&L and GST summary here.</p>
        <Link href="/dashboard/accura" className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-widest" style={{ background: "#1a1c1c", color: "#D4AF37" }}>
          Open Accura →
        </Link>
      </div>
    </div>
  );
}

function RateDeskDash() {
  const rates: { lane: string; carrier: string; teu: string; cbm: string; valid: string; status: string }[] = [];
  return (
    <div>
      <DashHeader title="RateDesk" badge="Dynamic Rate Management" action={{ label: "+ Add Rate", href: "#" }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="0" label="Active Rates" />
        <StatCard val="0" label="Expiring Soon" sub="Next 7 days" />
        <StatCard val="0" label="Quotes Sent" sub="This month" />
        <StatCard val="0" label="Quotes Converted" />
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
    { name: "ICEGATE", type: "Customs EDI", status: "Not Connected", calls: "—", lastSync: "—" },
    { name: "GSTN", type: "Tax API", status: "Not Connected", calls: "—", lastSync: "—" },
    { name: "WhatsApp Business API", type: "Notifications", status: "Not Connected", calls: "—", lastSync: "—" },
    { name: "MarineTraffic", type: "Vessel Tracking", status: "Not Connected", calls: "—", lastSync: "—" },
    { name: "Razorpay", type: "Payment Links", status: "Not Connected", calls: "—", lastSync: "—" },
    { name: "Tally Prime", type: "Accounting Sync", status: "Not Connected", calls: "—", lastSync: "—" },
  ];
  return (
    <div>
      <DashHeader title="ConnectLayer" badge="Native Integrations" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard val="0/6" label="Integrations Live" />
        <StatCard val="—" label="API Uptime" />
        <StatCard val="0" label="API Calls / Month" />
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
                <td className="px-6 py-3 font-semibold" style={{ color: int.status === "Connected" ? "#16A34A" : "#9CA3AF" }}>● {int.status}</td>
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
