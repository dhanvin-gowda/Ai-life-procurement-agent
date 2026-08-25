import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/backend/auth";


export default async function SelectProductPage() {
  if (!(await isAuthenticated())) {
    redirect("/signup");
  }

  return (
  );
}
