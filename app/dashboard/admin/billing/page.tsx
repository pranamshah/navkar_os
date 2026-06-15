"use client";

const PRODUCTS = [
  { name: "Nexlog", revenue: 0, color: "#1565C0", icon: "navigation" },
  { name: "EntryX", revenue: 0, color: "#5B21B6", icon: "gavel" },
  { name: "DockIQ", revenue: 0, color: "#0D7057", icon: "warehouse" },
  { name: "RunDesk", revenue: 0, color: "#92400E", icon: "local_shipping" },
  { name: "Accura", revenue: 0, color: "#1A237E", icon: "account_balance_wallet" },
  { name: "TradePilot", revenue: 0, color: "#004D40", icon: "public" },
];

const MOCK_SUBSCRIPTIONS: {
  clientId: string;
  client: string;
  product: string;
  plan: string;
  amount: string;
  status: string;
  date: string;
}[] = [];

const SUB_STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "rgba(34,197,94,0.1)", text: "#16a34a" },
  TRIAL: { bg: "rgba(30,64,175,0.12)", text: "#1E40AF" },
  CANCELLED: { bg: "rgba(239,68,68,0.1)", text: "#dc2626" },
  SUSPENDED: { bg: "rgba(156,163,175,0.15)", text: "#6b7280" },
};

const KPI_CARDS = [
  { label: "Total MRR", value: "₹0", icon: "trending_up", sub: "Monthly Recurring Revenue" },
  { label: "Active Subscriptions", value: "0", icon: "subscriptions", sub: "Paid + Trial plans" },
  { label: "Trials", value: "0", icon: "hourglass_empty", sub: "Currently in trial" },
  { label: "Churned This Month", value: "0", icon: "person_remove", sub: "Cancelled in June" },
];

const TABLE_COLUMNS = ["Client ID", "Client", "Product", "Plan", "Amount", "Status", "Date"];

const MAX_REVENUE = Math.max(...PRODUCTS.map((p) => p.revenue), 1);

export default function AdminBillingPage() {
  return (
    <div className="p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
          Admin
        </p>
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          Billing &amp; Revenue
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
          Platform revenue overview, subscriptions, and product breakdown.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPI_CARDS.map(({ label, value, icon, sub }) => (
          <div
            key={label}
            className="rounded-xl border bg-white p-5 flex flex-col gap-3"
            style={{ borderColor: "rgba(0,0,0,0.07)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                {label}
              </span>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#b0a8a9" }}>
                {icon}
              </span>
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: "#1a1c1c" }}>
                {value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#b0a8a9" }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Recent Subscription Events Table */}
        <div
          className="xl:col-span-2 rounded-xl border bg-white overflow-hidden"
          style={{ borderColor: "rgba(0,0,0,0.07)" }}
        >
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ background: "#f9f9fa", borderColor: "#E5E7EB" }}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#1E40AF" }}>
                receipt_long
              </span>
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
                Recent Subscription Events
              </h2>
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(30,64,175,0.1)", color: "#1E40AF" }}
            >
              {MOCK_SUBSCRIPTIONS.length} events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#f9f9fa", borderBottom: "1px solid #E5E7EB" }}>
                  {TABLE_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-semibold uppercase tracking-widest whitespace-nowrap"
                      style={{ color: "#b0a8a9" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_SUBSCRIPTIONS.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center" style={{ color: "#7e7576" }}>
                      No subscription events yet.
                    </td>
                  </tr>
                ) : (
                  MOCK_SUBSCRIPTIONS.map((sub, idx) => {
                    const statusStyle =
                      SUB_STATUS_STYLE[sub.status] ?? SUB_STATUS_STYLE.SUSPENDED;
                    return (
                      <tr
                        key={idx}
                        className="transition-colors hover:bg-[#fafafa]"
                        style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                      >
                        <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap" style={{ color: "#1E40AF" }}>
                          {sub.clientId}
                        </td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "#1a1c1c" }}>
                          {sub.client}
                        </td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap uppercase" style={{ color: "#4c4546" }}>
                          {sub.product}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-widest"
                            style={{ background: "rgba(0,0,0,0.04)", color: "#4c4546" }}
                          >
                            {sub.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "#1a1c1c" }}>
                          {sub.amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-widest"
                            style={{ background: statusStyle.bg, color: statusStyle.text }}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#7e7576" }}>
                          {sub.date}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue by Product */}
        <div
          className="rounded-xl border bg-white overflow-hidden self-start"
          style={{ borderColor: "rgba(0,0,0,0.07)" }}
        >
          <div
            className="px-6 py-4 border-b flex items-center gap-2"
            style={{ background: "#f9f9fa", borderColor: "#E5E7EB" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#1E40AF" }}>
              bar_chart
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
              Revenue by Product
            </h2>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {PRODUCTS.map(({ name, revenue, color, icon }) => {
              const pct = Math.round((revenue / MAX_REVENUE) * 100);
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 14, color }}
                      >
                        {icon}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "#1a1c1c" }}>
                        {name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold font-mono" style={{ color: "#7e7576" }}>
                      ₹{revenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(0,0,0,0.05)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: color,
                        opacity: 0.6,
                        minWidth: pct === 0 ? 0 : 4,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div
              className="mt-2 pt-4 flex items-center justify-between border-t"
              style={{ borderColor: "#F3F4F6" }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                Total MRR
              </span>
              <span className="text-sm font-black" style={{ color: "#1E40AF" }}>
                ₹{PRODUCTS.reduce((acc, p) => acc + p.revenue, 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state hint */}
      <div
        className="rounded-xl border p-6 flex items-center gap-4"
        style={{ background: "#1a1c1c", borderColor: "rgba(30,64,175,0.15)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(30,64,175,0.12)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1E40AF" }}>
            info
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "rgba(30,64,175,0.7)" }}>
            Beta Phase
          </p>
          <p className="text-sm font-semibold" style={{ color: "#ffffff" }}>
            Billing data will populate once paid subscriptions go live.
          </p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            Revenue metrics, MRR charts, and invoice history will appear here automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
