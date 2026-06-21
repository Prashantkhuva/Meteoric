import { FileText } from "lucide-react";

export default function ProposalsPage() {
  return (
    <div className="p-5 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Proposals</h1>
          <p className="mt-1 text-sm text-white/35">Create and manage proposals</p>
        </div>
      </div>
      <div className="border border-white/[0.06] bg-[#0a0a0a] p-16 text-center">
        <FileText size={40} className="mx-auto text-white/10 mb-4" />
        <p className="text-sm text-white/30">Proposals are coming in a future update.</p>
      </div>
    </div>
  );
}
