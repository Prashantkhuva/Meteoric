"use client";

import { useState, useEffect } from "react";
import { getSentEmails } from "../actions";
import { Pagination } from "../components/Pagination";
import { Mail, Paperclip, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 15;

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function SentEmailsPageContent() {
  const [emails, setEmails] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    getSentEmails(page, PAGE_SIZE).then((res) => {
      if (!cancelled) {
        setEmails(res.data);
        setTotal(res.total);
        setLoading(false);
      }
    });
    return () => { cancelled = true; controller.abort(); };
  }, [page]);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#EAEFFF]/10 flex items-center justify-center">
            <Mail size={20} className="text-[#EAEFFF]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white/90">Sent Emails</h1>
            <p className="text-xs text-white/40">{total} email{total !== 1 ? "s" : ""} sent</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EAEFFF] border-t-transparent" />
        </div>
      ) : emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-12 w-12 rounded-full bg-white/[0.03] flex items-center justify-center mb-3">
            <Mail size={20} className="text-white/20" />
          </div>
          <p className="text-sm text-white/40">No emails sent yet</p>
          <p className="text-xs text-white/25 mt-1">Go to Compose to send your first email</p>
        </div>
      ) : (
        <div className="border border-white/[0.06] bg-[#0a0a0a] rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[140px_140px_1fr_1fr_80px_60px] gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-white/30 font-medium">
            <span>Date</span>
            <span>From</span>
            <span>To</span>
            <span>Subject</span>
            <span className="text-center">Files</span>
            <span></span>
          </div>

          {/* Rows */}
          {emails.map((email) => (
            <div key={email.id}>
              <div
                className="grid grid-cols-[140px_140px_1fr_1fr_80px_60px] gap-4 px-5 py-3 border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors cursor-pointer items-center"
                onClick={() => toggleExpand(email.id)}
              >
                <div>
                  <p className="text-sm text-white/60">{formatDate(email.created_at)}</p>
                  <p className="text-[10px] text-white/30">{formatTime(email.created_at)}</p>
                </div>
                <p className="text-sm text-white/50 truncate">{email.from_address}</p>
                <p className="text-sm text-white/50 truncate">
                  {email.to_addresses?.join(", ") || "—"}
                </p>
                <p className="text-sm text-white/70 truncate">{email.subject}</p>
                <div className="flex items-center justify-center">
                  {email.attachments?.length ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-white/30">
                      <Paperclip size={11} />
                      {email.attachments.length}
                    </span>
                  ) : (
                    <span className="text-white/15">—</span>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  {expanded === email.id ? (
                    <ChevronUp size={14} className="text-white/30" />
                  ) : (
                    <ChevronDown size={14} className="text-white/30" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {expanded === email.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-white/[0.03] overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-white/[0.01]">
                      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Body Preview</p>
                      <div
                        className="text-sm text-white/50 prose prose-invert max-w-none [&_a]:text-[#EAEFFF] [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: email.body || "<em>No body</em>" }}
                      />
                      {email.attachments?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/[0.04]">
                          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Attachments</p>
                          <div className="flex flex-wrap gap-2">
                            {email.attachments.map((att, i) => (
                              <a
                                key={i}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-white/[0.03] text-xs text-white/50 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                              >
                                <Paperclip size={11} />
                                {att.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <Pagination current={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
