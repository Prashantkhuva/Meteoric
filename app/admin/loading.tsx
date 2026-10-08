export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-64 p-6 lg:p-8">
      <div className="flex items-center gap-3 text-white/50">
        <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}
