export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "#f9f9f9" }}>
      {children}
    </div>
  );
}
