import { redirect } from "next/navigation";
import { isAuthenticated } from "@/src/lib/auth";

export default async function Home() {
  const authed = await isAuthenticated();
  if (authed) {
    redirect("/select-product");
  } else {
    redirect("/signup");
  }
}
