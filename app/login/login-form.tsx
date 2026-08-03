"use client";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setIsLoading(true);
    setError("");
    try {
      const send_data = await fetch("/api/login",
        {
          method:"post",
          headers:{
            "content-Type":"application/json",
          },
          body:JSON.stringify({
            email:email,
            password:password,
          })
        }
      );
      const data = await send_data.json();
      if (!send_data.ok) {
        setError(data.error || "Login failed. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is not given");
      return;
    }
    if (!password) {
      setError("Password is not given");
      return;
    }
    await login();
  };

  return (
    <div className="login-root">
        {/* Decorative blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="login-card">
          {/* CPU Icon */}
          <div className="icon-wrap">
            <div className="icon-box">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0ea5c9"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
                {/* Top pins */}
                <line x1="9" y1="6.5" x2="9" y2="3.5" />
                <line x1="12" y1="6.5" x2="12" y2="3.5" />
                <line x1="15" y1="6.5" x2="15" y2="3.5" />
                {/* Bottom pins */}
                <line x1="9" y1="17.5" x2="9" y2="20.5" />
                <line x1="12" y1="17.5" x2="12" y2="20.5" />
                <line x1="15" y1="17.5" x2="15" y2="20.5" />
                {/* Left pins */}
                <line x1="6.5" y1="9" x2="3.5" y2="9" />
                <line x1="6.5" y1="12" x2="3.5" y2="12" />
                <line x1="6.5" y1="15" x2="3.5" y2="15" />
                {/* Right pins */}
                <line x1="17.5" y1="9" x2="20.5" y2="9" />
                <line x1="17.5" y1="12" x2="20.5" y2="12" />
                <line x1="17.5" y1="15" x2="20.5" y2="15" />
                {/* Inner square */}
                <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="login-title">
            <h1>AI Life Procurement</h1>
            <p>Agent Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <div className="input-wrap">
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input has-icon"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* Eye-off */
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    /* Eye */
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            {error && <p className="form-error">{error}</p>}
            <button
              type="submit"
              className="btn-signin"
              disabled={isLoading}
              aria-label="Sign in"
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  loging in…
                </>
              ) : (
                <>
                login
                  <svg
                    className="arrow-icon"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
            <p className="auth-switch">Don&apos;t have an account? <Link href="/signup">signup</Link></p>
          </form>
        </div>
      </div>
  );
}
