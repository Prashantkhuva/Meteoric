"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, List, ListOrdered, Link as LinkIcon, Check } from "lucide-react";

function ToolbarButton({ icon: Icon, onClick, active, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 transition-colors ${
        active ? "bg-[#EAEFFF]/10 text-[#EAEFFF]" : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"
      }`}
      aria-label={label}
      title={label}
    >
      <Icon size={15} />
    </button>
  );
}

function Toolbar({ editor }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-white/[0.06] px-3 py-2">
      <ToolbarButton
        icon={Bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        label="Bold"
      />
      <ToolbarButton
        icon={Italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        label="Italic"
      />
      <ToolbarButton
        icon={UnderlineIcon}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        label="Underline"
      />
      <span className="w-px h-4 bg-white/[0.06] mx-1" />
      <ToolbarButton
        icon={Heading1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        label="Heading 1"
      />
      <ToolbarButton
        icon={Heading2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        label="Heading 2"
      />
      <span className="w-px h-4 bg-white/[0.06] mx-1" />
      <ToolbarButton
        icon={List}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        label="Bullet list"
      />
      <ToolbarButton
        icon={ListOrdered}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        label="Ordered list"
      />
      <ToolbarButton
        icon={LinkIcon}
        onClick={() => {
          const url = window.prompt("URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        active={editor.isActive("link")}
        label="Insert link"
      />
    </div>
  );
}

export default function EditorView() {
  const searchParams = useSearchParams();

  const outputFormat = searchParams.get("fmt") === "html" ? "html" : "json";

  const initialContent = useMemo(() => {
    const raw = searchParams.get("c");
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch {
      return raw;
    }
  }, [searchParams]);

  const send = useCallback((type, payload) => {
    try {
      window.parent.postMessage({ type, payload }, "*");
    } catch {
      /* noop */
    }
  }, []);

  const emitContent = useCallback(
    (ed) => (outputFormat === "html" ? ed.getHTML() : ed.getJSON()),
    [outputFormat]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false },
      }),
      Placeholder.configure({ placeholder: "Start writing..." }),
      Underline,
    ],
    content: initialContent || "",
    onUpdate: ({ editor: ed }) => {
      send("meteoric-editor", { content: emitContent(ed) });
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none p-4 min-h-[calc(100vh-160px)] text-sm text-white/70 focus:outline-none [&_p.is-editor-empty:first-child::before]:text-white/20 [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child::before]:pointer-events-none",
      },
    },
  });

  useEffect(() => {
    function onMessage(event) {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "meteoric-editor-set" && data.payload?.content && editor) {
        editor.commands.setContent(data.payload.content);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="p-4 pt-10">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-white/30">Proposal editor</span>
        <button
          type="button"
          onClick={() => send("meteoric-editor-save", { content: emitContent(editor) })}
          className="inline-flex items-center gap-1.5 bg-[#EAEFFF] px-4 py-2 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <Check size={14} />
          Save
        </button>
      </div>
      <div className="border border-white/[0.06] bg-[#0a0a0a]">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}