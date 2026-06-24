import { createClient } from "@/lib/supabase/server";
import { generateProposalPdf, generateInvoicePdf } from "@/lib/pdf/generate";

export async function GET(request, { params }) {
  const { type, id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!["proposal", "invoice"].includes(type)) {
    return new Response("Invalid type", { status: 400 });
  }
  if (!token) {
    return new Response("Missing token", { status: 401 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return new Response("Service unavailable", { status: 500 });
  }

  try {
    if (type === "proposal") {
      const { data: proposal } = await supabase
        .from("proposals")
        .select("*, lead:leads(name, email, phone)")
        .eq("id", id)
        .eq("share_token", token)
        .single();

      if (!proposal) {
        return new Response("Not found", { status: 404 });
      }

      const pdfBuffer = await generateProposalPdf(proposal, proposal.lead);
      const filename = `Proposal-${proposal.title.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const { data: invoice } = await supabase
      .from("invoices")
      .select("*, client:clients(name, email, phone)")
      .eq("id", id)
      .eq("share_token", token)
      .single();

    if (!invoice) {
      return new Response("Not found", { status: 404 });
    }

    const pdfBuffer = await generateInvoicePdf(invoice, invoice.client);
    const filename = `Invoice-${invoice.invoice_number}.pdf`;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}
