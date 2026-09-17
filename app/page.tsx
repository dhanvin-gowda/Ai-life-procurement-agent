import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/backend/auth";

export default async function Home() {
  const authed = await isAuthenticated();
  if (authed) {
    redirect("/select-product");
  } else {
    redirect("/signup");
  }
}
