"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase not configured. Check your environment variables.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-[#070707] px-4 overflow-hidden">
      {/* Background effects */}
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
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EAEFFF] mb-5">
            <span className="text-base font-bold text-[#121212] tracking-tight">M</span>
          </div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-white">
            Meteoric
          </h1>
          <p className="mt-1.5 text-[13px] text-white/30 tracking-wide">
            Admin Dashboard
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-2xl p-7 shadow-[0_0_80px_rgba(234,239,255,0.02)]"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-[14px] text-white/90 placeholder-white/15 transition-all duration-200 focus:border-[#EAEFFF]/20 focus:outline-none focus:bg-white/[0.04]"
                placeholder="you@example.com"
              />
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
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-[14px] text-white/90 placeholder-white/15 transition-all duration-200 focus:border-[#EAEFFF]/20 focus:outline-none focus:bg-white/[0.04]"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-4 py-3">
              <p className="text-[13px] text-red-400/80">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#EAEFFF] px-4 py-3 text-[14px] font-semibold text-[#121212] transition-all duration-200 hover:bg-white active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
          >
            {loading ? (
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

        {/* Footer */}
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
