import { renderToBuffer } from "@react-pdf/renderer";
import "./fonts";
import ProposalPDF from "./ProposalPDF";
import InvoicePDF from "./InvoicePDF";

export async function generateProposalPdf(proposal, lead) {
  return renderToBuffer(
    <ProposalPDF proposal={proposal} lead={lead} />
  );
}

export async function generateInvoicePdf(invoice, client) {
  return renderToBuffer(
    <InvoicePDF invoice={invoice} client={client} />
  );
}
