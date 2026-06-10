export default function ComingSoon({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <span className="material-symbols-outlined mb-4" style={{ fontSize: 48, color: "#e5e7eb" }}>construction</span>
      <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 28, color: "#1a1c1c" }}>{feature}</h2>
      <p className="text-sm mt-2" style={{ color: "#7e7576" }}>This feature is under development and will be available soon.</p>
    </div>
  );
}
