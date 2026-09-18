import { redirect } from "next/navigation";
import { isAuthenticated } from "@/src/lib/auth";
import SignupForm from "./signup-form";

export default async function Signuppage() {
  if (await isAuthenticated()) {
    redirect("/select-product");
  }

  return <SignupForm />;
}
