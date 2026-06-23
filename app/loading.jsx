export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-white/40">
        <div className="h-5 w-5 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}
