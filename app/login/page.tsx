import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/backend/auth";
import LoginForm from "./login-form";

export default async function LoginPage() {
    if (await isAuthenticated()) {
    redirect("/select-product");
  }

  return <LoginForm />;
}
