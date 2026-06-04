"use client";
import dynamic from "next/dynamic";

const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false, loading: () => <div style={{ background: "#f9f9f9", width: "100%", height: "100%" }} /> }
);

export function ShaderBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      <MeshGradient
        style={{ width: "100%", height: "100%" }}
        colors={["#f9f9f9", "#f5f3ee", "#edeae3", "#ffffff"]}
        speed={0.18}
      />
    </div>
  );
}
