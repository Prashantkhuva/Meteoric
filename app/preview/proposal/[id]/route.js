import { createClient } from "@/lib/server";
import { cookies } from "next/headers";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/seo.config";

export async function GET(_request, { params }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const hasAuthCookie = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasAuthCookie) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login?redirect=/preview/proposal/" + id },
    });
  }

  const supabase = await createClient();
  if (!supabase) {
    return new Response("Service unavailable", { status: 500 });
  }

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*, lead:leads(name, email, phone)")
    .eq("id", id)
    .single();

  if (!proposal) {
    return new Response("Not found", { status: 404 });
  }

  const statusLabel = proposal.status === "sent" ? "Sent" : proposal.status === "draft" ? "Draft" : proposal.status;
  const statusClass = proposal.status === "sent" ? "sent" : "";

  function fmt(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  const proposalContent = renderContent(proposal.content);
  const ogUrl = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(proposal.title)} — Meteoric Proposal</title>
<meta property="og:title" content="${esc(proposal.title)} — Meteoric Proposal" />
<meta property="og:description" content="Proposal prepared for ${esc(proposal.lead?.name || "—")} by Meteoric." />
<meta property="og:image" content="${ogUrl}" />
<meta property="og:image:width" content="1635" />
<meta property="og:image:height" content="962" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #070707; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; color: rgba(255,255,255,0.85); }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; max-width: 800px; margin-left: auto; margin-right: auto; }
.toolbar a { color: rgba(255,255,255,0.4); text-decoration: none; font-size: 13px; transition: color 0.2s; }
.toolbar a:hover { color: rgba(255,255,255,0.7); }
.print-btn { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); border: 1px solid rgba(255,255,255,0.08); padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
.print-btn:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.15); }
.proposal { max-width: 800px; margin: 0 auto; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.06); padding: 48px 56px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.brand img { height: 40px; width: auto; display: block; }
.meta { text-align: right; }
.meta .title { font-size: 22px; font-weight: 700; color: rgba(255,255,255,0.95); }
.meta .status { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; color: rgba(255,255,255,0.3); }
.meta .status.sent { color: #34d399; }
.meta .date { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 8px; }
.to { margin-bottom: 48px; }
.to h3 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.2); margin-bottom: 8px; }
.to p { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6); }
.to .name { font-weight: 600; color: rgba(255,255,255,0.85); }
.content { line-height: 1.7; color: rgba(255,255,255,0.65); font-size: 14px; }
.content h2 { font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.9); margin-top: 32px; margin-bottom: 12px; }
.content h3 { font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.85); margin-top: 24px; margin-bottom: 8px; }
.content p { margin-bottom: 16px; }
.content ul, .content ol { margin-bottom: 16px; padding-left: 24px; }
.content li { margin-bottom: 4px; }
.content strong { color: rgba(255,255,255,0.9); }
.content a { color: #EAEFFF; text-decoration: underline; }
.footer { margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); }
.footer h4 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.2); margin-bottom: 4px; }
.footer p { font-size: 13px; color: rgba(255,255,255,0.5); white-space: pre-wrap; margin-bottom: 16px; }
@media print {
  body { background: #070707; padding: 0; }
  .toolbar { display: none !important; }
  .proposal { box-shadow: none; padding: 40px 48px; }
  @page { margin: 20mm 15mm; }
}
</style>
</head>
<body>
<div class="toolbar">
  <a href="/admin/proposals">&larr; Back to Proposals</a>
  <button class="print-btn" onclick="window.print()">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    Download PDF
  </button>
</div>

<div class="proposal">
  <div class="header">
    <div class="brand">
      <img src="/meteoric-logo.png" alt="Meteoric" />
    </div>
    <div class="meta">
      <p class="title">${esc(proposal.title)}</p>
      <p class="status${statusClass ? " " + statusClass : ""}">${statusLabel}</p>
      ${proposal.sent_at ? '<p class="date">Sent: ' + fmt(proposal.sent_at) + "</p>" : ""}
      ${proposal.created_at ? '<p class="date">Created: ' + fmt(proposal.created_at) + "</p>" : ""}
    </div>
  </div>

  <div class="to">
    <h3>Prepared for</h3>
    ${proposal.lead ? "<p class='name'>" + esc(proposal.lead.name) + "</p>" + (proposal.lead.email ? "<p>" + esc(proposal.lead.email) + "</p>" : "") : "<p>&mdash;</p>"}
  </div>

  <div class="content">
    ${proposalContent}
  </div>

  ${proposal.timeline ? `
  <div class="footer">
    <h4>Timeline</h4>
    <p>${esc(proposal.timeline)}</p>
  </div>
  ` : ""}

  ${proposal.terms ? `
  <div class="footer">
    <h4>Terms & Conditions</h4>
    <p>${esc(proposal.terms)}</p>
  </div>
  ` : ""}
</div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function esc(s) {
  if (typeof s !== "string") return s;
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderContent(content) {
  if (!content) return "";
  if (typeof content === "string") return "<p>" + esc(content) + "</p>";
  if (content.type === "doc" && content.content) {
    return content.content.map((node) => renderNode(node)).join("\n");
  }
  return "";
}

function renderNode(node) {
  if (!node) return "";
  switch (node.type) {
    case "paragraph":
      return "<p>" + renderInline(node.content) + "</p>";
    case "heading": {
      const level = node.attrs?.level || 2;
      return "<h" + level + ">" + renderInline(node.content) + "</h" + level + ">";
    }
    case "bulletList":
      return "<ul>" + (node.content || []).map((item) => "<li>" + renderInline(item.content) + "</li>").join("") + "</ul>";
    case "orderedList":
      return "<ol>" + (node.content || []).map((item) => "<li>" + renderInline(item.content) + "</li>").join("") + "</ol>";
    default:
      return "<p>" + renderInline(node.content) + "</p>";
  }
}

function renderInline(content) {
  if (!content) return "";
  return content.map((node) => {
    if (node.type === "hardBreak") return "<br>";
    if (node.type === "text") {
      let text = esc(node.text || "");
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === "bold") text = "<strong>" + text + "</strong>";
          if (mark.type === "italic") text = "<em>" + text + "</em>";
          if (mark.type === "underline") text = "<u>" + text + "</u>";
          if (mark.type === "link") {
            const href = mark.attrs?.href || "";
            const safe = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") ? href : "";
            text = '<a href="' + esc(safe) + '" target="_blank" rel="noopener noreferrer">' + text + "</a>";
          }
        }
      }
      return text;
    }
    return "";
  }).join("");
}
