import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";

export async function GET(_request, { params }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const hasAuthCookie = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasAuthCookie) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login?redirect=/preview/invoice/" + id },
    });
  }

  const supabase = await createClient();
  if (!supabase) {
    return new Response("Service unavailable", { status: 500 });
  }

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, client:clients(name, email, company)")
    .eq("id", id)
    .single();

  if (!invoice) {
    return new Response("Not found", { status: 404 });
  }

  const items = invoice.items || [];
  const subtotal = items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0), 0);
  const tax = Number(invoice.tax) || 0;
  const total = Number(invoice.total) || subtotal + tax;

  function fmt(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  function itemAmount(item) {
    return ((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2);
  }

  const statusClass = invoice.status === "overdue" ? "overdue" : invoice.status === "paid" ? "paid" : "";
  const statusLabel = invoice.status === "overdue" ? "Overdue" : invoice.status === "paid" ? "Paid" : invoice.status;
  const ogUrl = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Invoice ${invoice.invoice_number} — Meteoric</title>
<meta property="og:title" content="Invoice ${invoice.invoice_number} — Meteoric" />
<meta property="og:description" content="Invoice for ${esc(invoice.client?.name || "—")} — $${total.toFixed(2)} due ${invoice.due_date ? fmt(invoice.due_date) : "—"}" />
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
.invoice { max-width: 800px; margin: 0 auto; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.06); padding: 48px 56px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.brand img { height: 32px; width: 168px; display: block; }
.meta { text-align: right; }
.meta .number { font-size: 22px; font-weight: 700; color: rgba(255,255,255,0.95); }
.meta .status { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; color: rgba(255,255,255,0.3); }
.meta .status.paid { color: #34d399; }
.meta .status.overdue { color: #f87171; }
.meta .dates { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 8px; line-height: 1.6; }
.meta .dates .paid { color: #34d399; font-weight: 600; }
.parties { display: flex; justify-content: space-between; margin-bottom: 48px; gap: 40px; }
.from h3, .to h3 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.2); margin-bottom: 8px; }
.from p, .to p { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6); }
.from .name, .to .name { font-weight: 600; color: rgba(255,255,255,0.85); }
.to { text-align: right; }
table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
thead th { text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.2); padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); }
thead th:not(:first-child) { text-align: right; }
tbody td { padding: 12px 0; font-size: 13px; color: rgba(255,255,255,0.6); border-bottom: 1px solid rgba(255,255,255,0.04); }
tbody td:not(:first-child) { text-align: right; }
tbody td:first-child { color: rgba(255,255,255,0.85); }
.totals { margin-left: auto; width: 280px; }
.totals .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: rgba(255,255,255,0.5); }
.totals .row.total { padding: 12px 0 0; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.15); font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.95); }
.footer { margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); }
.footer h4 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.2); margin-bottom: 4px; }
.footer p { font-size: 13px; color: rgba(255,255,255,0.5); white-space: pre-wrap; margin-bottom: 16px; }
@media print {
  body { background: #070707; padding: 0; }
  .toolbar { display: none !important; }
  .invoice { box-shadow: none; padding: 40px 48px; }
  @page { margin: 20mm 15mm; }
}
</style>
</head>
<body>
<div class="toolbar">
  <a href="/admin/invoices">&larr; Back to Invoices</a>
  <button class="print-btn" onclick="window.print()">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    Download PDF
  </button>
</div>

<div class="invoice">
  <div class="header">
    <div class="brand">
      <img src="/meteoric-logo.png" alt="Meteoric" />
    </div>
    <div class="meta">
      <p class="number">${invoice.invoice_number}</p>
      <p class="status${statusClass ? " " + statusClass : ""}">${statusLabel}</p>
      <div class="dates">
        ${invoice.created_at ? "<p>Issued: " + fmt(invoice.created_at) + "</p>" : ""}
        ${invoice.due_date ? "<p>Due: " + fmt(invoice.due_date) + "</p>" : ""}
        ${invoice.paid_at ? '<p class="paid">Paid: ' + fmt(invoice.paid_at) + "</p>" : ""}
      </div>
    </div>
  </div>

  <div class="parties">
    <div class="from">
      <h3>From</h3>
      <p class="name">Meteoric</p>
      <p>contact@withmeteoric.com</p>
    </div>
    <div class="to">
      <h3>To</h3>
      ${invoice.client ? "<p class='name'>" + esc(invoice.client.name) + "</p>" + (invoice.client.company ? "<p>" + esc(invoice.client.company) + "</p>" : "") + (invoice.client.email ? "<p>" + esc(invoice.client.email) + "</p>" : "") : "<p>&mdash;</p>"}
    </div>
  </div>

  ${items.length > 0 ? `
  <table>
    <thead>
      <tr>
        <th style="width:auto">Description</th>
        <th style="width:64px">Qty</th>
        <th style="width:96px">Rate</th>
        <th style="width:112px">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(function(item) {
        return "<tr><td>" + esc(item.description) + "</td><td>" + item.quantity + "</td><td>$" + Number(item.rate).toFixed(2) + "</td><td>$" + itemAmount(item) + "</td></tr>";
      }).join("")}
    </tbody>
  </table>
  ` : ""}

  <div class="totals">
    <div class="row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    ${tax > 0 ? '<div class="row"><span>Tax</span><span>$' + tax.toFixed(2) + "</span></div>" : ""}
    <div class="row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
  </div>

  ${(invoice.notes || invoice.terms) ? `
  <div class="footer">
    ${invoice.notes ? "<h4>Notes</h4><p>" + esc(invoice.notes) + "</p>" : ""}
    ${invoice.terms ? "<h4>Terms & Conditions</h4><p>" + esc(invoice.terms) + "</p>" : ""}
  </div>
  ` : ""}
</div>
</body>
</html>`;

  function esc(s) {
    if (typeof s !== "string") return s;
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
