import "./fonts";
import { renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import ProposalPDF from "./ProposalPDF";
import InvoicePDF from "./InvoicePDF";

let logoDataUri, upiLogoDataUri;

function getLogo() {
  if (!logoDataUri) {
    try {
      const logoPath = path.join(
        process.cwd(),
        "public",
        "new-meteoric-lg.svg",
      );
      const buffer = fs.readFileSync(logoPath);
      logoDataUri = `data:image/svg+xml;base64,${buffer.toString("base64")}`;
    } catch {
      logoDataUri = null;
    }
  }
  return logoDataUri;
}

function getUpiLogo() {
  if (!upiLogoDataUri) {
    try {
      const p = path.join(process.cwd(), "public", "new-upi-lg.svg");
      const b = fs.readFileSync(p);
      upiLogoDataUri = `data:image/svg+xml;base64,${b.toString("base64")}`;
    } catch {
      upiLogoDataUri = null;
    }
  }
  return upiLogoDataUri;
}

export async function generateProposalPdf(proposal, lead) {
  return renderToBuffer(
    <ProposalPDF proposal={proposal} lead={lead} logo={getLogo()} />,
  );
}

export async function generateInvoicePdf(
  invoice,
  client,
  wiseCurrency,
  previewUrl,
) {
  return renderToBuffer(
    <InvoicePDF
      invoice={invoice}
      client={client}
      logo={getLogo()}
      upiLogo={getUpiLogo()}
      wiseCurrency={wiseCurrency}
      previewUrl={previewUrl}
    />,
  );
}
