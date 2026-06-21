"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, List, ListOrdered, Link as LinkIcon } from "lucide-react";

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

export function RichEditor({ content, onChange, placeholder = "Start writing..." }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || "",
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none p-4 min-h-[200px] text-sm text-white/70 focus:outline-none [&_p.is-editor-empty:first-child::before]:text-white/20 [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child::before]:pointer-events-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a]">
      <Toolbar editor={editor} />
      <div className="max-h-[300px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
