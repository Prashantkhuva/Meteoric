import { Suspense } from "react";
import PageContent from "./PageContent";

function Fallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#EAEFFF] border-t-transparent" />
        <p className="text-sm text-white/40">Loading...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<Fallback />}><PageContent /></Suspense>;
}
