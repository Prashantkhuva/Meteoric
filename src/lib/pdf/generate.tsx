import "./fonts";
import { renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import ProposalPDF from "./ProposalPDF";
import InvoicePDF from "./InvoicePDF";
import type { Client, Invoice, Lead, Proposal } from "@/lib/types";

let logoDataUri: string | null = null;
let upiLogoDataUri: string | null = null;

function getLogo(): string | null {
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

function getUpiLogo(): string | null {
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

export async function generateProposalPdf(proposal: Proposal, lead: Lead): Promise<Buffer> {
  return renderToBuffer(
    <ProposalPDF proposal={proposal} lead={lead} logo={getLogo()} />,
  );
}

export async function generateInvoicePdf(
  invoice: Invoice,
  client: Client,
  wiseCurrency: string,
  previewUrl?: string,
): Promise<Buffer> {
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
