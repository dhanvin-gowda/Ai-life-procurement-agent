import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/backend/auth";
import SelectProductClient from "./select-product-client";

export default async function SelectProductPage() {
  if (!(await isAuthenticated())) {
    redirect("/signup");
  }

  return <SelectProductClient />;
}

