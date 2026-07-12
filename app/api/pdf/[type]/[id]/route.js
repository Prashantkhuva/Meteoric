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
      const { data, error } = await supabase.rpc("get_proposal_with_lead", {
        proposal_id: id,
        token,
      });
      if (error || !data) {
        return new Response("Not found", { status: 404 });
      }
      const proposal = typeof data === "string" ? JSON.parse(data) : data;

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

    const { data, error } = await supabase.rpc("get_invoice_with_client", {
      invoice_id: id,
      token,
    });
    if (error || !data) {
      return new Response("Not found", { status: 404 });
    }
    const invoice = typeof data === "string" ? JSON.parse(data) : data;

    const pdfBuffer = await generateInvoicePdf(invoice, invoice.client, invoice.currency || "USD");
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
