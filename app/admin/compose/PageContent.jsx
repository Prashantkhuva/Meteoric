"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getRecipients, sendCustomEmailAction } from "../actions";
import { RichEditor } from "../components/RichEditor";
import { useToast } from "../components/ToastContext";
import { Send, Paperclip, X, ChevronDown, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SENDER_OPTIONS = [
  { value: "contact", label: "General", email: "contact@withmeteoric.com" },
  { value: "admin", label: "Admin", email: "admin@withmeteoric.com" },
  { value: "billing", label: "Billing", email: "billing@withmeteoric.com" },
  { value: "support", label: "Support", email: "support@withmeteoric.com" },
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ComposePageContent() {
  const addToast = useToast();
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);

  const [from, setFrom] = useState("contact");
  const [to, setTo] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);

  const [recipients, setRecipients] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownFilter, setDropdownFilter] = useState("all");
  const dropdownRef = useRef(null);

  useEffect(() => {
    getRecipients().then((res) => {
      if (res.data) setRecipients(res.data);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRecipients = recipients.filter((r) => {
    if (to.includes(r.email)) return false;
    const matchSearch =
      !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchType = dropdownFilter === "all" || r.type === dropdownFilter;
    return matchSearch && matchType;
  });

  const addRecipient = useCallback((email) => {
    setTo((prev) => (prev.includes(email) ? prev : [...prev, email]));
    setSearch("");
    setShowDropdown(false);
  }, []);

  const addCustomEmail = useCallback(() => {
    const trimmed = search.trim();
    if (trimmed && trimmed.includes("@") && !to.includes(trimmed)) {
      setTo((prev) => [...prev, trimmed]);
      setSearch("");
      setShowDropdown(false);
    }
  }, [search, to]);

  const removeRecipient = useCallback((email) => {
    setTo((prev) => prev.filter((e) => e !== email));
  }, []);

  const handleFiles = useCallback((newFiles) => {
    const incoming = Array.from(newFiles);
    setFiles((prev) => {
      const remaining = MAX_FILES - prev.length;
      const allowed = incoming
        .filter((f) => f.size <= MAX_FILE_SIZE)
        .slice(0, remaining);
      if (allowed.length < incoming.length) {
        if (prev.length >= MAX_FILES) {
          console.warn(`Max ${MAX_FILES} files allowed`);
        }
      }
      return [...prev, ...allowed];
    });
  }, []);

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSend = useCallback(async () => {
    if (!to.length || !subject.trim() || !body.trim()) return;

    setSending(true);
    try {
      const fd = new FormData();
      fd.append("from", from);
      fd.append("to", JSON.stringify(to));
      fd.append("subject", subject.trim());
      fd.append("body", body);
      files.forEach((f) => fd.append("attachments", f));

      const result = await sendCustomEmailAction(fd);

      if (result.error) {
        addToast(result.error, "error");
      } else {
        addToast("Email sent successfully", "success");
        setTo([]);
        setSubject("");
        setBody("");
        setFiles([]);
      }
    } catch (err) {
      addToast(err.message || "Failed to send", "error");
    } finally {
      setSending(false);
    }
  }, [from, to, subject, body, files, addToast]);

  const canSend = to.length > 0 && subject.trim() && body.trim() && !sending;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-[#EAEFFF]/10 flex items-center justify-center">
          <Mail size={20} className="text-[#EAEFFF]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white/90">Compose Email</h1>
          <p className="text-xs text-white/40">Write and send emails from your professional addresses</p>
        </div>
      </div>

      {/* From */}
      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-wider text-white/40 font-medium">From</label>
        <div className="flex items-center gap-0">
          <div className="relative">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="appearance-none bg-[#0a0a0a] border border-white/[0.06] border-r-0 text-white/80 text-sm rounded-l-xl px-4 py-2.5 pr-8 focus:outline-none focus:border-[#EAEFFF]/20 cursor-pointer"
            >
              {SENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>
          <div className="bg-black/40 border border-white/[0.06] border-l-0 rounded-r-xl px-4 py-2.5 text-sm text-white/40">
            @withmeteoric.com
          </div>
        </div>
      </div>

      {/* To */}
      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-wider text-white/40 font-medium">To</label>
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/[0.06] rounded-xl px-3 py-2 min-h-[42px] flex-wrap focus-within:border-[#EAEFFF]/20 transition-colors">
            {to.map((email) => (
              <span
                key={email}
                className="inline-flex items-center gap-1 bg-[#EAEFFF]/10 text-[#EAEFFF] text-xs px-2.5 py-1 rounded-lg"
              >
                {email}
                <button
                  type="button"
                  onClick={() => removeRecipient(email)}
                  className="hover:text-white/60 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (filteredRecipients.length > 0) {
                    addRecipient(filteredRecipients[0].email);
                  } else {
                    addCustomEmail();
                  }
                }
                if (e.key === "Escape") setShowDropdown(false);
              }}
              placeholder={to.length ? "Add more..." : "Search contacts or type email..."}
              className="flex-1 min-w-[160px] bg-transparent text-sm text-white/70 placeholder:text-white/25 focus:outline-none"
            />
          </div>

          <AnimatePresence>
            {showDropdown && (search || filteredRecipients.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute z-50 mt-1 w-full bg-[#0a0a0a] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="flex items-center gap-1 p-1.5 border-b border-white/[0.06]">
                  {["all", "lead", "client"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDropdownFilter(t)}
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg transition-colors ${
                        dropdownFilter === t
                          ? "bg-[#EAEFFF]/10 text-[#EAEFFF]"
                          : "text-white/30 hover:text-white/50"
                      }`}
                    >
                      {t === "all" ? "All" : t === "lead" ? "Leads" : "Clients"}
                    </button>
                  ))}
                </div>

                <div className="max-h-[240px] overflow-y-auto">
                  {filteredRecipients.length > 0 ? (
                    filteredRecipients.map((r) => (
                      <button
                        key={`${r.type}-${r.id}`}
                        type="button"
                        onClick={() => addRecipient(r.email)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.03] transition-colors text-left"
                      >
                        <div className="h-7 w-7 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-medium text-white/50 shrink-0">
                          {(r.name || r.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/70 truncate">{r.name || "Unnamed"}</p>
                          <p className="text-xs text-white/35 truncate">{r.email}</p>
                        </div>
                        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          r.type === "lead" ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                        }`}>
                          {r.type}
                        </span>
                      </button>
                    ))
                  ) : search.includes("@") ? (
                    <button
                      type="button"
                      onClick={addCustomEmail}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.03] transition-colors text-left"
                    >
                      <div className="h-7 w-7 rounded-full bg-[#EAEFFF]/10 flex items-center justify-center shrink-0">
                        <Mail size={13} className="text-[#EAEFFF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/70 truncate">{search}</p>
                        <p className="text-xs text-white/35">Send to this email</p>
                      </div>
                    </button>
                  ) : (
                    <p className="px-3 py-4 text-xs text-white/30 text-center">No contacts found</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-wider text-white/40 font-medium">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject..."
          className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 placeholder:text-white/25 focus:outline-none focus:border-[#EAEFFF]/20 transition-colors"
        />
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-wider text-white/40 font-medium">Body</label>
        <RichEditor
          content={body}
          onChange={setBody}
          placeholder="Write your email..."
          outputFormat="html"
        />
      </div>

      {/* Attachments */}
      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-wider text-white/40 font-medium">Attachments</label>
        <div className="border border-white/[0.06] bg-[#0a0a0a] rounded-xl p-3">
          {files.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/[0.02] rounded-lg px-3 py-2">
                  <Paperclip size={13} className="text-white/30 shrink-0" />
                  <span className="text-sm text-white/60 truncate flex-1">{file.name}</span>
                  <span className="text-[10px] text-white/30 shrink-0">
                    {file.size > 1024 * 1024
                      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                      : `${(file.size / 1024).toFixed(0)} KB`}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-white/20 hover:text-red-400 transition-colors shrink-0"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {files.length < MAX_FILES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              <Paperclip size={13} />
              Add files ({files.length}/{MAX_FILES})
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Send Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] text-[#121212] font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-[#EAEFFF]/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {sending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#121212] border-t-transparent" />
              Sending...
            </>
          ) : (
            <>
              <Send size={15} />
              Send Email
            </>
          )}
        </button>
      </div>
    </div>
  );
}
