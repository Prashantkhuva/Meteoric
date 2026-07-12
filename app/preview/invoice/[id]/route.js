import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import fs from "fs";
import path from "path";

const CURRENCIES = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
};

function getCurrencySymbol(currency) {
  return CURRENCIES[currency] || "$";
}

export async function GET(request, { params }) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  const supabase = await createClient();
  if (!supabase) {
    return new Response("Service unavailable", { status: 500 });
  }

  let invoice;

  if (token) {
    const { data, error } = await supabase.rpc("get_invoice_with_client", {
      invoice_id: id,
      token,
    });
    if (error || !data) {
      return new Response("Not found", { status: 404 });
    }
    invoice = typeof data === "string" ? JSON.parse(data) : data;
  } else {
    const cookieStore = await cookies();
    const hasAuthCookie = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
    if (!hasAuthCookie) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login?redirect=/preview/invoice/" + id },
      });
    }

    const { data, error } = await supabase
      .from("invoices")
      .select("*, client:clients(name, email, company), bank_account:bank_accounts(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return new Response("Not found", { status: 404 });
    }
    invoice = data;
  }

  if (!invoice) {
    return new Response("Not found", { status: 404 });
  }

  const items = invoice.items || [];
  const subtotal = items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0), 0);
  const tax = Number(invoice.tax) || 0;
  const total = Number(invoice.total) || subtotal + tax;
  const currency = getCurrencySymbol(invoice.currency);

  function fmt(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  function itemAmount(item) {
    return ((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2);
  }

  const statusClass = invoice.status === "overdue" ? "overdue" : invoice.status === "paid" ? "paid" : invoice.status === "sent" ? "sent" : "draft";
  const statusLabel = invoice.status === "overdue" ? "Overdue" : invoice.status === "paid" ? "Paid" : invoice.status === "sent" ? "Sent" : invoice.status === "draft" ? "Draft" : invoice.status;
  const ogUrl = `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  let logoSrc = "";
  try {
    const logoBuf = fs.readFileSync(path.join(process.cwd(), "public", "meteoric.png"));
    logoSrc = `data:image/png;base64,${logoBuf.toString("base64")}`;
  } catch { /* logo file not found, fall back to text */ }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Invoice ${invoice.invoice_number} — Meteoric</title>
<meta property="og:title" content="Invoice ${invoice.invoice_number} — Meteoric" />
<meta property="og:description" content="Invoice for ${esc(invoice.client?.name || "—")} — ${currency}${total.toFixed(2)} due ${invoice.due_date ? fmt(invoice.due_date) : "—"}" />
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
.wise-btn { background: #9FE870; color: #0a0a0a !important; border: none; padding: 12px 20px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; text-decoration: none; border-radius: 6px; }
.wise-btn:hover { background: #8BD660; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(159, 232, 112, 0.25); }
.wise-btn img { filter: brightness(0); display: block; width: 72px; height: 16px; }
.paypal-btn { background: #0070BA; color: #ffffff !important; border: none; padding: 12px 16px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; text-decoration: none; border-radius: 6px; }
.paypal-btn:hover { background: #005C99; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 112, 186, 0.35); }
.paypal-btn img { filter: brightness(0) invert(1); display: block; width: 20px; height: 20px; }
.toolbar-right { display: flex; gap: 10px; align-items: center; }
.invoice { max-width: 800px; margin: 0 auto; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.06); padding: 48px 56px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.brand { display: flex; align-items: center; }
.brand-logo { height: 32px; width: auto; }
.meta { text-align: right; }
.meta .number { font-size: 22px; font-weight: 700; color: rgba(255,255,255,0.95); }
.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 4px; margin-top: 10px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; border: 1px solid; }
.status-badge .dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.status-badge.draft { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); }
.status-badge.draft .dot { background: rgba(255,255,255,0.3); }
.status-badge.sent { background: rgba(34,34,37,1); border-color: rgba(232,228,255,0.12); color: #E8E4FF; }
.status-badge.sent .dot { background: #E8E4FF; }
.status-badge.paid { background: rgba(74,222,128,0.10); border-color: rgba(74,222,128,0.18); color: #4ade80; }
.status-badge.paid .dot { background: #4ade80; }
.status-badge.overdue { background: rgba(248,113,113,0.10); border-color: rgba(248,113,113,0.18); color: #f87171; }
.status-badge.overdue .dot { background: #f87171; }
.meta .dates { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 8px; line-height: 1.6; }
.meta .dates .paid { color: #34d399; font-weight: 600; }
.parties { display: flex; justify-content: space-between; margin-bottom: 48px; gap: 40px; }
.from h3, .to h3 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.2); margin-bottom: 8px; }
.from p, .to p { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.6); }
.from .name, .to .name { font-weight: 600; color: rgba(255,255,255,0.85); }
.to { text-align: right; }
.table-wrap { overflow-x: auto; }
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
.bank-section { margin-top: 24px; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
.bank-section h4 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #EAEFFF; margin-bottom: 10px; }
.bank-line { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.8; }
.bank-line strong { color: rgba(255,255,255,0.35); }
@media (max-width: 639px) {
  body { padding: 16px 10px; }
  .toolbar { flex-wrap: wrap; gap: 8px; }
  .toolbar-right { flex-wrap: wrap; gap: 8px; }
  .wise-btn { padding: 10px 14px; }
  .wise-btn img { width: 56px; height: 13px; }
  .paypal-btn { padding: 10px 12px; }
  .paypal-btn img { width: 16px; height: 16px; }
  .print-btn { padding: 10px 14px; font-size: 12px; }
  .invoice { padding: 24px 16px; }
  .header { flex-direction: column; gap: 12px; margin-bottom: 32px; padding-bottom: 24px; }
  .brand-logo { height: 28px; }
  .meta { text-align: left; }
  .meta .number { font-size: 20px; }
  .parties { flex-direction: column; gap: 20px; margin-bottom: 32px; }
  .to { text-align: left; }
  .footer { margin-top: 32px; padding-top: 24px; }
}
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
  <div class="toolbar-right">
    ${invoice.status !== "paid" ? '<a class="wise-btn" href="https://wise.com/pay/business/khuvaprashantdayanandbhai1?currency=' + (invoice.currency || "USD") + '&amount=' + total.toFixed(2) + '" target="_blank" aria-label="Pay with Wise"><img src="/wiselogo.svg" alt="Wise" width="72" height="16" /></a>' : ""}
    ${invoice.status !== "paid" ? '<a class="paypal-btn" href="https://paypal.me/Prashantkhuva/' + total.toFixed(2) + '" target="_blank" aria-label="Pay with PayPal"><img src="/paypal.svg" alt="PayPal" width="20" height="20" /></a>' : ""}
    <button class="print-btn" onclick="window.print()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      Download PDF
    </button>
  </div>
</div>

<div class="invoice">
  <div class="header">
    <div class="brand">
      ${logoSrc ? '<img class="brand-logo" src="' + logoSrc + '" alt="Meteoric" />' : '<span class="brand-logo" style="font-size:28px;font-weight:500;background:linear-gradient(135deg,#fff 0%,#a0a0a0 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text"><span style="font-family:\'Playfair Display\',serif;font-style:normal">meteor</span><span style="font-family:Inter,system-ui,sans-serif">ic</span></span>'}
    </div>
    <div class="meta">
      <p class="number">${invoice.invoice_number}</p>
      <span class="status-badge ${statusClass || "draft"}"><span class="dot"></span>${statusLabel}</span>
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
  <div class="table-wrap"><table>
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
        return "<tr><td>" + esc(item.description) + "</td><td>" + item.quantity + "</td><td>" + currency + Number(item.rate).toFixed(2) + "</td><td>" + currency + itemAmount(item) + "</td></tr>";
      }).join("")}
    </tbody>
  </table></div>
  ` : ""}

  <div class="totals">
    <div class="row"><span>Subtotal</span><span>${currency}${subtotal.toFixed(2)}</span></div>
    ${tax > 0 ? '<div class="row"><span>Tax</span><span>' + currency + tax.toFixed(2) + "</span></div>" : ""}
    <div class="row total"><span>Total</span><span>${currency}${total.toFixed(2)}</span></div>
  </div>

  ${invoice.status !== "paid" && invoice.bank_account ? `
  <div class="bank-section">
    <h4>Bank Transfer Details</h4>
    ${invoice.bank_account.label ? '<p class="bank-line"><strong>Account:</strong> ' + esc(invoice.bank_account.label) + "</p>" : ""}
    ${invoice.bank_account.bank_name ? '<p class="bank-line"><strong>Bank:</strong> ' + esc(invoice.bank_account.bank_name) + "</p>" : ""}
    ${invoice.bank_account.account_holder ? '<p class="bank-line"><strong>Name:</strong> ' + esc(invoice.bank_account.account_holder) + "</p>" : ""}
    ${invoice.bank_account.account_number ? '<p class="bank-line"><strong>Account No:</strong> ' + esc(invoice.bank_account.account_number) + "</p>" : ""}
    ${invoice.bank_account.iban ? '<p class="bank-line"><strong>IBAN:</strong> ' + esc(invoice.bank_account.iban) + "</p>" : ""}
    ${invoice.bank_account.swift_bic ? '<p class="bank-line"><strong>SWIFT/BIC:</strong> ' + esc(invoice.bank_account.swift_bic) + "</p>" : ""}
    ${invoice.bank_account.routing_number ? '<p class="bank-line"><strong>Routing:</strong> ' + esc(invoice.bank_account.routing_number) + "</p>" : ""}
    ${invoice.bank_account.ifsc ? '<p class="bank-line"><strong>IFSC:</strong> ' + esc(invoice.bank_account.ifsc) + "</p>" : ""}
    ${invoice.bank_account.currency ? '<p class="bank-line"><strong>Currency:</strong> ' + esc(invoice.bank_account.currency) + "</p>" : ""}
    ${invoice.bank_account.country ? '<p class="bank-line"><strong>Country:</strong> ' + esc(invoice.bank_account.country) + "</p>" : ""}
  </div>
  ` : ""}

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
