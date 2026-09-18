import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { user, connectDB } from "@/src/lib/database";
import { createAuthToken, setAuthCookie } from "@/src/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await user.findOne({ email: normalizedEmail });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = createAuthToken(existingUser.email);
    await setAuthCookie(token);

    return NextResponse.json(
      { id: existingUser._id, email: existingUser.email },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }
}
