import { Font, renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import ProposalPDF from "./ProposalPDF";
import InvoicePDF from "./InvoicePDF";

const fontsDir = path.join(process.cwd(), "src", "lib", "pdf", "fonts");

function loadFontDataUrl(filename) {
  const buffer = fs.readFileSync(path.join(fontsDir, filename));
  return `data:font/woff;base64,${buffer.toString("base64")}`;
}

const interRegular = loadFontDataUrl("Inter-Regular.woff");
const interBold = loadFontDataUrl("Inter-Bold.woff");
const interItalic = loadFontDataUrl("Inter-Italic.woff");
const interBoldItalic = loadFontDataUrl("Inter-BoldItalic.woff");

Font.register({
  family: "Inter",
  fonts: [
    { src: interRegular, fontWeight: 400, fontStyle: "normal" },
    { src: interBold, fontWeight: 700, fontStyle: "normal" },
    { src: interItalic, fontWeight: 400, fontStyle: "italic" },
    { src: interBoldItalic, fontWeight: 700, fontStyle: "italic" },
  ],
});

Font.register({ family: "Inter-Bold", src: interBold });
Font.register({ family: "Inter-Italic", src: interItalic });
Font.register({ family: "Inter-BoldItalic", src: interBoldItalic });

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
