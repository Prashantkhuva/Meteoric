"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot, Send, Loader2, User, Sparkles } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export default function AIAssistant({ open, onClose }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const trapRef = useFocusTrap(open);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/admin/ai",
      onResponse: () => setShowWelcome(false),
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60"
        onClick={onClose}
      />
      <motion.div
        ref={trapRef}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-white/[0.06] bg-[#0a0a0a] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-assistant-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center border border-[#EAEFFF]/20 bg-[#EAEFFF]/5">
              <Bot size={14} className="text-[#EAEFFF]/70" />
            </div>
            <div>
              <h2 id="ai-assistant-title" className="text-sm font-semibold tracking-tight text-white/90">
                AI Assistant
              </h2>
              <span className="text-[10px] text-white/30">Ask anything about your agency</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/30 hover:text-white/60 transition-colors hover:bg-white/[0.04]"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {showWelcome && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="flex h-12 w-12 items-center justify-center border border-[#EAEFFF]/10 bg-[#EAEFFF]/5 mb-4">
                <Sparkles size={22} className="text-[#EAEFFF]/50" />
              </div>
              <p className="text-sm text-white/60 mb-6 max-w-xs">
                Ask me about your leads, revenue, proposals, or anything about your agency.
              </p>
              <div className="space-y-2 w-full max-w-sm">
                {[
                  "How many leads do I have?",
                  "Show me my revenue stats",
                  "Any overdue invoices?",
                  "Recent leads from this week",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setShowWelcome(false);
                      const form = document.createElement("form");
                      const input = document.createElement("input");
                      input.name = "input";
                      input.value = q;
                      form.appendChild(input);
                      handleInputChange({ target: { value: q } });
                      setTimeout(() => {
                        handleSubmit(new Event("submit"));
                      }, 50);
                    }}
                    className="block w-full text-left border border-white/[0.06] px-4 py-2.5 text-xs text-white/40 hover:text-white/70 hover:border-white/[0.12] hover:bg-white/[0.02] transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.length > 0 && (
            <>
              {messages
                .filter((m) => m.role !== "system")
                .map((m) => (
                  <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                    {m.role === "assistant" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#EAEFFF]/10 bg-[#EAEFFF]/5 mt-0.5">
                        <Bot size={12} className="text-[#EAEFFF]/50" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-[#EAEFFF]/10 text-white/80"
                          : "bg-white/[0.03] text-white/60 border border-white/[0.04]"
                      }`}
                    >
                      <div className="prose prose-invert prose-sm max-w-none [&_pre]:bg-black/40 [&_pre]:p-3 [&_pre]:text-xs [&_pre]:overflow-x-auto">
                        {m.content || (
                          <span className="text-white/30 italic">Thinking...</span>
                        )}
                      </div>
                      {m.toolInvocations && (
                        <div className="mt-2 pt-2 border-t border-white/[0.04]">
                          <span className="text-[10px] text-white/20">
                            Used: {m.toolInvocations.map((t) => t.toolName).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                    {m.role === "user" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/[0.06] bg-white/[0.03] mt-0.5">
                        <User size={12} className="text-white/30" />
                      </div>
                    )}
                  </div>
                ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#EAEFFF]/10 bg-[#EAEFFF]/5">
                    <Bot size={12} className="text-[#EAEFFF]/50" />
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.04] px-4 py-2.5">
                    <Loader2 size={14} className="text-white/30 animate-spin" />
                  </div>
                </div>
              )}
              {error && (
                <div className="border border-red-500/10 bg-red-500/5 px-4 py-3">
                  <p className="text-xs text-red-400/70">{error.message || "Something went wrong"}</p>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/[0.06] px-5 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              name="input"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask anything..."
              className="flex-1 border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#EAEFFF]/20"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-40"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
