import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Admin routes have their own layout — just pass through
  return <>{children}</>;
}
