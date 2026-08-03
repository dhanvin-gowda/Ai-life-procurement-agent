import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function createAuthToken(email: string): string {
  const secret = process.env.JWT_TOKEN;
  if (!secret) {
    throw new Error("JWT_TOKEN is not set");
  }
  return jwt.sign({ email }, secret, { expiresIn: "7d" });
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, process.env.JWT_TOKEN as string);
    return true;
  } catch {
    return false;
  }
}

