import Logo from "@/components/sections/Logo";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9970] flex flex-col items-center justify-center gap-8"
      style={{ background: "#050505" }}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(60vw,420px)] w-[min(60vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(234,239,255,0.12) 0%, transparent 70%)",
          animation: "preload-glow 1.6s ease-in-out infinite",
        }}
      />

      <div className="relative opacity-90">
        <Logo light={false} className="h-6 w-auto md:h-7" />
      </div>

      <div className="relative h-px w-40 overflow-hidden bg-white/10">
        <div
          className="absolute inset-y-0 w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent, #EAEFFF, transparent)",
            animation: "preload-sweep 1.1s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
