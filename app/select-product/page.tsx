import { redirect } from "next/navigation";
import { isAuthenticated } from "@/src/lib/auth";
import SelectProductClient from "./select-product-client";

export default async function SelectProductPage() {
  if (!(await isAuthenticated())) {
    redirect("/signup");
  }

  return <SelectProductClient />;
}

