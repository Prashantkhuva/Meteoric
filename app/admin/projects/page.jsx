import { FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="p-5 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Projects</h1>
          <p className="mt-1 text-sm text-white/35">Track client projects and milestones</p>
        </div>
      </div>
      <div className="border border-white/[0.06] bg-[#0a0a0a] p-16 text-center">
        <FolderKanban size={40} className="mx-auto text-white/10 mb-4" />
        <p className="text-sm text-white/30">Projects are coming in a future update.</p>
      </div>
    </div>
  );
}
