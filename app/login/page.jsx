"use client";

import { Suspense, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";
import Image from "next/image";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(320, "Email too long")
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password too long"),
});

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

function isSafeRedirect(path) {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("\\") || path.includes("\r") || path.includes("\n")) return false;
  try {
    new URL(path, window.location.origin);
  } catch {
    return false;
  }
  return true;
}

function getFriendlyError(msg) {
  const lower = (msg || "").toLowerCase();
  if (lower.includes("invalid login") || lower.includes("invalid") || lower.includes("credentials"))
    return "Invalid email or password.";
  if (lower.includes("email not confirmed")) return "Please confirm your email first.";
  if (lower.includes("rate limit")) return "Too many attempts. Please try again later.";
  if (lower.includes("network") || lower.includes("fetch"))
    return "Network error. Check your connection.";
  return "Something went wrong. Please try again.";
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/admin";
  const redirect = isSafeRedirect(rawRedirect) ? rawRedirect : "/admin";

  const [isLocked, setIsLocked] = useState(false);

  const checkLockout = useCallback(() => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      setIsLocked(true);
      return true;
    }
    setIsLocked(false);
    return false;
  }, [lockoutUntil]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (checkLockout()) return;

      setError(null);
      setFieldErrors({});

      const parsed = loginSchema.safeParse({ email, password });
      if (!parsed.success) {
        const errs = {};
        parsed.error.issues.forEach((issue) => {
          const key = issue.path[0];
          if (key) errs[key] = issue.message;
        });
        setFieldErrors(errs);
        return;
      }

      setLoading(true);

      const supabase = createClient();
      if (!supabase) {
        setError("Service temporarily unavailable.");
        setLoading(false);
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (authError) {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);

        if (nextAttempts >= MAX_ATTEMPTS) {
          setLockoutUntil(Date.now() + LOCKOUT_MS);
          setAttempts(0);
          setError("Too many failed attempts. Locked for 60 seconds.");
        } else {
          setError(getFriendlyError(authError.message));
        }
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    },
    [email, password, attempts, checkLockout, redirect, router]
  );

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-[#070707] px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#EAEFFF]/[0.025] blur-[180px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#EAEFFF]/[0.015] blur-[140px] rounded-full" />
        <div className="absolute top-[60%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-[#EAEFFF]/[0.01] blur-[200px] rounded-full" />
      </div>

      <div className="relative w-full max-w-[380px]">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EAEFFF] mb-5 overflow-hidden">
            <Image
              src="/m.png"
              alt="Meteoric"
              width={48}
              height={48}
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-white">
            Meteoric
          </h1>
          <p className="mt-1.5 text-[13px] text-white/30 tracking-wide">
            Admin Dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-2xl p-7 shadow-[0_0_80px_rgba(234,239,255,0.02)]"
          noValidate
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-semibold tracking-[0.08em] text-white/30 uppercase mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: null }));
                }}
                className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[14px] text-white/90 placeholder-white/15 transition-all duration-200 focus:outline-none focus:bg-white/[0.04] ${
                  fieldErrors.email
                    ? "border-red-500/30 focus:border-red-500/40"
                    : "border-white/[0.06] focus:border-[#EAEFFF]/20"
                }`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-[12px] text-red-400/70">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-semibold tracking-[0.08em] text-white/30 uppercase mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: null }));
                }}
                className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[14px] text-white/90 placeholder-white/15 transition-all duration-200 focus:outline-none focus:bg-white/[0.04] ${
                  fieldErrors.password
                    ? "border-red-500/30 focus:border-red-500/40"
                    : "border-white/[0.06] focus:border-[#EAEFFF]/20"
                }`}
                placeholder="Enter your password"
              />
              {fieldErrors.password && (
                <p className="mt-1.5 text-[12px] text-red-400/70">{fieldErrors.password}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-4 py-3">
              <p className="text-[13px] text-red-400/80">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            className="mt-6 w-full rounded-xl bg-[#EAEFFF] px-4 py-3 text-[14px] font-semibold text-[#121212] transition-all duration-200 hover:bg-white active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
          >
            {isLocked ? (
              "Locked — try again shortly"
            ) : loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] text-white/15 tracking-wide">
          Protected area — authorized personnel only
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
