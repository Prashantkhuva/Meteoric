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
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-[#EAEFFF]/[0.015] blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="flex items-center justify-center h-10 w-10 rounded-2xl bg-[#EAEFFF] text-sm font-bold text-[#121212]">
              M
            </span>
          </div>
          <p className="text-2xl font-semibold tracking-tight text-white">
            Meteoric<span className="text-[#EAEFFF]">.</span>
          </p>
          <p className="mt-2 text-sm text-white/35">Admin Dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-[#EAEFFF]/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(234,239,255,0.03)]"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold tracking-wider text-white/40 uppercase"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#EAEFFF]/10 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all duration-200 focus:border-[#EAEFFF]/30 focus:outline-none focus:ring-1 focus:ring-[#EAEFFF]/10"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold tracking-wider text-white/40 uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#EAEFFF]/10 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all duration-200 focus:border-[#EAEFFF]/30 focus:outline-none focus:ring-1 focus:ring-[#EAEFFF]/10"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400/80 bg-red-500/5 border border-red-500/10 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-[#EAEFFF] px-4 py-2.5 text-sm font-semibold text-[#121212] transition-all duration-200 hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
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
