"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
      <p className="text-red-400 text-sm font-mono max-w-xl text-center">
        {error.message || "An unexpected error occurred"}
      </p>
      <p className="text-xs text-white/30 font-mono">Digest: {error.digest}</p>
      <button
        onClick={reset}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white/80 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
