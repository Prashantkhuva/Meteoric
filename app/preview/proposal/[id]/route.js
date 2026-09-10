import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  const supabase = await createClient();
  if (!supabase) {
    return new Response("Service unavailable", { status: 500 });
  }

  let proposal;

  if (token) {
    const { data, error } = await supabase.rpc("get_proposal_with_lead", {
      proposal_id: id,
      token,
    });
    if (error || !data) {
      return new Response("Not found", { status: 404 });
    }
    proposal = typeof data === "string" ? JSON.parse(data) : data;
  } else {
    const cookieStore = await cookies();
    const hasAuthCookie = cookieStore
      .getAll()
      .some((c) => c.name.startsWith("sb-"));
    if (!hasAuthCookie) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login?redirect=/preview/proposal/" + id },
      });
    }

    const { data, error } = await supabase
      .from("proposals")
      .select("*, lead:leads(name, email, phone)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return new Response("Not found", { status: 404 });
    }
    proposal = data;
  }

  if (!proposal) {
    return new Response("Not found", { status: 404 });
  }

  const statusLabel =
    proposal.status === "sent"
      ? "Sent"
      : proposal.status === "draft"
        ? "Draft"
        : proposal.status;
  const statusClass = proposal.status === "sent" ? "sent" : "";

  function fmt(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const proposalContent = renderContent(proposal.content);
  const ogUrl = `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  let logoSrc = "";
  try {
    const logoBuf = fs.readFileSync(
      path.join(process.cwd(), "public", "new-meteoric-lg-black.svg"),
    );
    logoSrc = `data:image/svg+xml;base64,${logoBuf.toString("base64")}`;
  } catch {
    /* logo file not found, fall back to text */
  }

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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #f5f5f5; padding: 40px 20px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; color: #1a1a1a; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; max-width: 800px; margin-left: auto; margin-right: auto; }
.toolbar a { color: #6b7280; text-decoration: none; font-size: 13px; font-weight: 500; transition: color 0.2s; }
.toolbar a:hover { color: #111827; }
.print-btn { background: #111827; color: #ffffff; border: none; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; border-radius: 6px; }
.print-btn:hover { background: #374151; }
.proposal { max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; padding: 48px 56px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid #e5e7eb; }
.brand { display: flex; align-items: center; }
.brand-logo { height: 32px; width: auto; }
.meta { text-align: right; }
.meta .title { font-size: 22px; font-weight: 700; color: #111827; }
.meta .status { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; color: #9ca3af; }
.meta .status.sent { color: #16a34a; }
.meta .date { font-size: 12px; color: #9ca3af; margin-top: 8px; }
.to { margin-bottom: 48px; }
.to h3 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 8px; }
.to p { font-size: 13px; line-height: 1.5; color: #6b7280; }
.to .name { font-weight: 600; color: #111827; }
.content { line-height: 1.7; color: #4b5563; font-size: 14px; }
.content h2 { font-size: 18px; font-weight: 700; color: #111827; margin-top: 32px; margin-bottom: 12px; }
.content h3 { font-size: 16px; font-weight: 600; color: #111827; margin-top: 24px; margin-bottom: 8px; }
.content p { margin-bottom: 16px; }
.content ul, .content ol { margin-bottom: 16px; padding-left: 24px; }
.content li { margin-bottom: 4px; }
.content strong { color: #111827; }
.content a { color: #4f46e5; text-decoration: underline; }
.footer { margin-top: 48px; padding-top: 32px; border-top: 1px solid #e5e7eb; }
.footer h4 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 4px; }
.footer p { font-size: 13px; color: #6b7280; white-space: pre-wrap; margin-bottom: 16px; }
@media (max-width: 639px) {
  body { padding: 16px 10px; }
  .toolbar { gap: 8px; }
  .toolbar a { white-space: nowrap; }
  .print-btn { padding: 10px 16px; white-space: nowrap; }
  .proposal { padding: 24px 16px; }
  .header { flex-direction: column; gap: 12px; margin-bottom: 32px; padding-bottom: 24px; }
  .brand-logo { height: 28px; }
  .meta { text-align: left; }
  .meta .title { font-size: 20px; }
  .to { margin-bottom: 32px; }
  .content p { word-wrap: break-word; overflow-wrap: break-word; }
  .content a { word-wrap: break-word; overflow-wrap: break-word; }
  .footer { margin-top: 32px; padding-top: 24px; }
}
@media print {
  body { background: #ffffff; padding: 0; }
  .toolbar { display: none !important; }
  .proposal { border: none; box-shadow: none; padding: 40px 48px; }
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
      ${logoSrc ? '<img class="brand-logo" src="' + logoSrc + '" alt="Meteoric" />' : '<span class="brand-logo" style="font-size:28px;font-weight:600;color:#111827"><span style="font-family:\'Playfair Display\',serif;font-style:normal">meteor</span><span style="font-family:Inter,system-ui,sans-serif">ic</span></span>'}
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

  ${
    proposal.timeline
      ? `
  <div class="footer">
    <h4>Timeline</h4>
    <p>${esc(proposal.timeline)}</p>
  </div>
  `
      : ""
  }

  ${
    proposal.terms
      ? `
  <div class="footer">
    <h4>Terms & Conditions</h4>
    <p>${esc(proposal.terms)}</p>
  </div>
  `
      : ""
  }
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
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
      return (
        "<h" + level + ">" + renderInline(node.content) + "</h" + level + ">"
      );
    }
    case "bulletList":
      return (
        "<ul>" +
        (node.content || [])
          .map((item) => "<li>" + renderInline(item.content) + "</li>")
          .join("") +
        "</ul>"
      );
    case "orderedList":
      return (
        "<ol>" +
        (node.content || [])
          .map((item) => "<li>" + renderInline(item.content) + "</li>")
          .join("") +
        "</ol>"
      );
    default:
      return "<p>" + renderInline(node.content) + "</p>";
  }
}

function renderInline(content) {
  if (!content) return "";
  return content
    .map((node) => {
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
              const safe =
                href.startsWith("http://") ||
                href.startsWith("https://") ||
                href.startsWith("mailto:")
                  ? href
                  : "";
              text =
                '<a href="' +
                esc(safe) +
                '" target="_blank" rel="noopener noreferrer">' +
                text +
                "</a>";
            }
          }
        }
        return text;
      }
      return "";
    })
    .join("");
}
