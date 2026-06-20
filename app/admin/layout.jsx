import Sidebar from "./_components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-dvh bg-black">
      {/* Ambient bg glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#EAEFFF]/[0.015] blur-[160px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#EAEFFF]/[0.01] blur-[120px] rounded-full" />
      </div>

      <Sidebar />

      <div className="relative flex flex-1 flex-col">
        {/* Glass header */}
        <header className="flex items-center justify-between border-b border-[#EAEFFF]/10 bg-black/30 backdrop-blur-xl px-6 h-14">
          <span className="text-xs text-white/25 font-medium tracking-widest uppercase">
            Admin Panel
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-[#EAEFFF]/10 px-3 py-1 text-xs text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              Live
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
