import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_TOKEN || "ai-life-procurement-secret-key-2026";

export function createAuthToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
}

export async function getAuthenticatedUserEmail(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === "object" && payload !== null && "email" in payload) {
      const email = (payload as { email?: unknown }).email;
      return typeof email === "string" ? email.toLowerCase() : null;
    }
  } catch {
    return null;
  }

  return null;
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

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return false;
    }

    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
