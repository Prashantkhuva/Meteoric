import { renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import ProposalPDF from "./ProposalPDF";
import InvoicePDF from "./InvoicePDF";

let logoDataUri;

function getLogo() {
  if (!logoDataUri) {
    try {
      const logoPath = path.join(process.cwd(), "public", "meteoric-logo.png");
      const buffer = fs.readFileSync(logoPath);
      logoDataUri = `data:image/png;base64,${buffer.toString("base64")}`;
    } catch {
      logoDataUri = null;
    }
  }
  return logoDataUri;
}

export async function generateProposalPdf(proposal, lead) {
  return renderToBuffer(
    <ProposalPDF proposal={proposal} lead={lead} logo={getLogo()} />
  );
}

export async function generateInvoicePdf(invoice, client) {
  return renderToBuffer(
    <InvoicePDF invoice={invoice} client={client} logo={getLogo()} />
  );
}
