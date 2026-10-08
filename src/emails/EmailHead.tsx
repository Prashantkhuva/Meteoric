import { Head } from "react-email";

const css = `
:root { color-scheme: light; supported-color-schemes: light; }
u + .body .email-page { background-color: #f5f5f3 !important; background-image: linear-gradient(#f5f5f3, #f5f5f3) !important; }
u + .body > table > tbody > tr > td { background-color: #f5f5f3 !important; background-image: linear-gradient(#f5f5f3, #f5f5f3) !important; }
u + .body .email-card { background-color: #ffffff !important; background-image: linear-gradient(#ffffff, #ffffff) !important; }
u + .body .email-inset { background-color: #fafaf7 !important; background-image: linear-gradient(#fafaf7, #fafaf7) !important; }
u + .body .email-banner { background-color: #faf6f6 !important; background-image: linear-gradient(#faf6f6, #faf6f6) !important; }
@media (prefers-color-scheme: dark) {
  .email-page { background-color: #f5f5f3 !important; background-image: linear-gradient(#f5f5f3, #f5f5f3) !important; }
  .email-card { background-color: #ffffff !important; background-image: linear-gradient(#ffffff, #ffffff) !important; }
  .email-inset { background-color: #fafaf7 !important; background-image: linear-gradient(#fafaf7, #fafaf7) !important; }
  .email-banner { background-color: #faf6f6 !important; background-image: linear-gradient(#faf6f6, #faf6f6) !important; }
}
[data-ogsb] .email-page { background-color: #f5f5f3 !important; background-image: linear-gradient(#f5f5f3, #f5f5f3) !important; }
[data-ogsb] .email-card { background-color: #ffffff !important; background-image: linear-gradient(#ffffff, #ffffff) !important; }
[data-ogsb] .email-inset { background-color: #fafaf7 !important; background-image: linear-gradient(#fafaf7, #fafaf7) !important; }
[data-ogsb] .email-banner { background-color: #faf6f6 !important; background-image: linear-gradient(#faf6f6, #faf6f6) !important; }
`;

export default function EmailHead() {
  return (
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
      <style>{css}</style>
    </Head>
  );
}
