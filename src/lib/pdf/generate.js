import { Font, renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import ProposalPDF from "./ProposalPDF";
import InvoicePDF from "./InvoicePDF";

Font.register({ family: "system-ui", src: "Helvetica" });
Font.register({ family: "-apple-system", src: "Helvetica" });
Font.register({ family: "sans-serif", src: "Helvetica" });

let logoDataUri;

function getLogo() {
  if (!logoDataUri) {
    try {
      const logoPath = path.join(process.cwd(), "public", "logo.svg");
      const buffer = fs.readFileSync(logoPath);
      logoDataUri = `data:image/svg+xml;base64,${buffer.toString("base64")}`;
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

export async function generateInvoicePdf(invoice, client, wiseCurrency, previewUrl) {
  return renderToBuffer(
    <InvoicePDF invoice={invoice} client={client} logo={getLogo()} wiseCurrency={wiseCurrency} previewUrl={previewUrl} />
  );
}
