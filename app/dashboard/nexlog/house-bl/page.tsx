"use client";

import { useState } from "react";

export default function HouseBlPage() {
  const [tab, setTab] = useState<"hbl" | "hawb">("hbl");
  const inputCls = "w-full px-3 py-2 rounded-md border text-[12px] outline-none focus:border-[#1565C0]";

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>House BL / HAWB Generator</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>FIATA HBL · IATA HAWB · Direct PDF download</p>
        </div>
        <div className="flex rounded-md border" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
          <button onClick={() => setTab("hbl")} className="px-4 py-1.5 text-[12px] font-semibold" style={{ background: tab === "hbl" ? "#1565C0" : "transparent", color: tab === "hbl" ? "#fff" : "#374151" }}>House BL</button>
          <button onClick={() => setTab("hawb")} className="px-4 py-1.5 text-[12px] font-semibold" style={{ background: tab === "hawb" ? "#1565C0" : "transparent", color: tab === "hawb" ? "#fff" : "#374151" }}>HAWB</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>{tab === "hbl" ? "FIATA House Bill of Lading" : "IATA House Air Waybill"}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Shipper</label><textarea rows={3} className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Consignee</label><textarea rows={3} className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Notify Party</label><textarea rows={3} className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Issuing Agent</label><textarea rows={3} className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>{tab === "hbl" ? "Port of Loading" : "Airport of Departure"}</label><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>{tab === "hbl" ? "Port of Discharge" : "Airport of Destination"}</label><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>{tab === "hbl" ? "Vessel & Voyage" : "Flight No"}</label><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Place of Receipt</label><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
            </div>
            <div>
              <label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Marks & Numbers / Cargo Description</label>
              <textarea rows={4} className={inputCls} style={{ borderColor: "#E5E7EB" }} />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Freight Terms</label><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>FREIGHT PREPAID</option><option>FREIGHT COLLECT</option></select></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Originals</label><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Place of Issue</label><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Date of Issue</label><input type="date" className={inputCls} style={{ borderColor: "#E5E7EB" }} /></div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 px-4 py-2 rounded-md text-[13px] font-semibold text-white" style={{ background: "#1565C0" }}>Generate PDF</button>
              <button className="px-4 py-2 rounded-md text-[13px] font-medium border" style={{ borderColor: "#E5E7EB", color: "#374151" }}>Save Draft</button>
            </div>
          </div>
        </div>

        <div className="col-span-2 rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>Preview</h3>
          <div className="rounded-lg border p-4 text-[10px] font-mono leading-snug" style={{ borderColor: "#1565C0", background: "#FAFAFA", borderTopWidth: 3 }}>
            <div className="text-center font-bold text-[11px] mb-3" style={{ color: "#1565C0" }}>NAVKAR FREIGHT CO.</div>
            <div className="text-center font-bold mb-3" style={{ color: "#111827" }}>{tab === "hbl" ? "HOUSE BILL OF LADING" : "HOUSE AIR WAYBILL"}</div>
            <div className="border-t border-b py-2 my-2 grid grid-cols-2 gap-2" style={{ borderColor: "#E5E7EB" }}>
              <div><div className="text-[8px] uppercase" style={{ color: "#9CA3AF" }}>HBL No</div><div style={{ color: "#111827" }}>NXL/{tab === "hbl" ? "HBL" : "HAWB"}/2026/089</div></div>
              <div><div className="text-[8px] uppercase" style={{ color: "#9CA3AF" }}>Date</div><div style={{ color: "#111827" }}>15 May 2026</div></div>
            </div>
            <div className="mb-2"><div className="text-[8px] uppercase font-bold" style={{ color: "#9CA3AF" }}>Shipper</div><div style={{ color: "#111827", whiteSpace: "pre-line" }}>{`Shanghai Electronics Ltd\n12 Nanjing Road, Shanghai`}</div></div>
            <div className="mb-2"><div className="text-[8px] uppercase font-bold" style={{ color: "#9CA3AF" }}>Consignee</div><div style={{ color: "#111827", whiteSpace: "pre-line" }}>{`Ravi Exports Pvt Ltd\nPlot 42, MIDC Pune`}</div></div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div><div className="text-[8px] uppercase font-bold" style={{ color: "#9CA3AF" }}>{tab === "hbl" ? "POL" : "Dep"}</div><div style={{ color: "#111827" }}>{tab === "hbl" ? "CNSHA" : "PVG"}</div></div>
              <div><div className="text-[8px] uppercase font-bold" style={{ color: "#9CA3AF" }}>{tab === "hbl" ? "POD" : "Dest"}</div><div style={{ color: "#111827" }}>{tab === "hbl" ? "INNSA" : "BOM"}</div></div>
            </div>
            <div className="mb-2"><div className="text-[8px] uppercase font-bold" style={{ color: "#9CA3AF" }}>Cargo</div><div style={{ color: "#111827" }}>120 CTNS · Electronics · 12,500 kg · 28.5 CBM</div></div>
            <div className="border-t mt-3 pt-2 text-center text-[8px]" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>FREIGHT PREPAID · 3 ORIGINALS · MUMBAI</div>
          </div>
        </div>
      </div>
    </div>
  );
}
