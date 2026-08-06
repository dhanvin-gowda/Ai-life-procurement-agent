import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/backend/auth";
import SignupForm from "./signup-form";

export default async function Signuppage() {
  if (await isAuthenticated()) {
    redirect("/select-product");
  }

  return <SignupForm />;
}
