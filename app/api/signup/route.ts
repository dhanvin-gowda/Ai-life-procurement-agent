import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { user as User, connectDB } from "@/src/lib/database";
import { createAuthToken, setAuthCookie } from "@/src/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const search_email = await User.findOne({ email: normalizedEmail });
    if (search_email) {
      return NextResponse.json(
        { error: "Email already exists, please login" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createAuthToken(user.email);
    await setAuthCookie(token);

    return NextResponse.json(
      { id: user._id, email: user.email },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
