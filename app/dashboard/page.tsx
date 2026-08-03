import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/backend/auth";

export default async function DashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/signup");
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
