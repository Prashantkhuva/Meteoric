"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-semibold tracking-tight text-white mb-2">Something went wrong</h1>
        <p className="text-sm text-white/40 mb-8 leading-relaxed">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-6 py-2.5 text-sm font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
