import { render } from "react-email";
import LeadAutoReply from "./src/emails/lead-autoreply.jsx";

const html = await render(LeadAutoReply({ name: "Test" }));
const matches = [...html.matchAll(/font-family[^;]*;/gi)];
console.log("Found", matches.length, "font-family:");
matches.forEach((m) => console.log("  ->", m[0]));
if (html.includes("system-ui") || html.includes("-apple-system")) {
  console.log("STILL HAS SYSTEM FONTS!");
  const idx = html.indexOf("system-ui");
  console.log("Context:", html.substring(Math.max(0, idx - 100), idx + 200));
} else {
  console.log("No system fonts found");
}
