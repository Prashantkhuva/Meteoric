import { Suspense } from "react";
import EditorView from "./EditorView";

export const metadata = {
  title: "Editor",
  robots: { index: false, follow: false },
};

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-[#070707]">
      <Suspense fallback={<div className="p-6 text-sm text-white/40">Loading editor...</div>}>
        <EditorView />
      </Suspense>
    </div>
  );
}