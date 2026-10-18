import { callOpenRouterText, openRouterConfigured } from "./openrouter";

export type FollowUpDraft = {
  whatsapp: string;
  email: string;
  subject: string;
  model: string | null;
  usage_cost: number | null;
  source: "ai" | "template";
};

const SYSTEM = `You are Meteoric's client follow-up assistant. Meteoric is a web development agency (Next.js, SaaS, Supabase).
Write ONE WhatsApp message and ONE short email for a follow-up on a lead/client.
Rules:
- Friendly, professional, concise. No hype, no emojis unless the original conversation used them.
- Never invent facts (pricing, dates, deliverables) not present in the context.
- WhatsApp: 2-4 sentences, plain text, ends with one soft CTA question.
- Email: subject <= 60 chars, body 3 short paragraphs max, ends with one soft CTA.
- Do not include the recipient's phone or email.
Return ONLY strict JSON:
{"whatsapp":"...","email":"...","subject":"..."}`;

function escapeXml(s: string) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function leadXml(lead: Record<string, any>) {
  const fields: [string, unknown][] = [
    ["name", lead?.name],
    ["company", lead?.company],
    ["services", lead?.services],
    ["budget", lead?.budget],
    ["timeline", lead?.timeline],
    ["status", lead?.status],
    ["source", lead?.source],
    ["details", lead?.details],
    ["notes", lead?.notes],
    ["follow_up_note", lead?.follow_up_note],
    ["follow_up_status", lead?.follow_up_status],
    ["follow_up_at", lead?.follow_up_at],
  ];
  return fields
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(([k, v]) => `<${k}>${escapeXml(String(v)).slice(0, 800)}</${k}>`)
    .join("\n");
}

function templateDraft(lead: Record<string, any>): FollowUpDraft {
  const first = String(lead?.name || "there").trim().split(/\s+/)[0];
  const company = String(lead?.company || "").trim();
  const services = String(lead?.services || "your project").trim();
  const details = String(lead?.details || "").trim();
  const who = company ? `${first} (${company})` : first;

  const whatsapp = `Hi ${first}, checking in on ${services}${company ? ` for ${company}` : ""}. ${
    details
      ? "I re-read your notes and wanted to confirm priorities on our side."
      : "Wanted to see if anything is still open on your end."
  } Anything blocking the next step? Happy to hop on a quick call this week.`;

  const subject = `Following up on ${services}`;
  const email = `Hi ${first},

I'm following up on ${services}${company ? ` for ${company}` : ""}. ${
    details
      ? "Based on what you shared, we're ready to move forward whenever you are."
      : "We'd love to hear where things stand on your side."
  }

If it helps, I can send a short plan with timeline and next steps — just reply here and we'll set it up.

Best,
Prashant
Meteoric · withmeteoric.com`;

  return {
    whatsapp,
    email,
    subject,
    model: null,
    usage_cost: 0,
    source: "template",
  };
}

function parseJson(text: string): { whatsapp: string; email: string; subject: string } | null {
  try {
    const cleaned = text.replace(/```(json)?/g, "").trim();
    const obj = JSON.parse(cleaned);
    if (
      typeof obj?.whatsapp === "string" &&
      typeof obj?.email === "string" &&
      typeof obj?.subject === "string" &&
      obj.whatsapp.trim() &&
      obj.email.trim()
    ) {
      return {
        whatsapp: obj.whatsapp.trim(),
        email: obj.email.trim(),
        subject: String(obj.subject).trim().slice(0, 80),
      };
    }
  } catch {
    /* fall through */
  }
  return null;
}

export async function draftFollowUp(lead: Record<string, any>): Promise<FollowUpDraft> {
  if (openRouterConfigured()) {
    try {
      const res = await callOpenRouterText(SYSTEM, `<lead>\n${leadXml(lead)}\n</lead>`);
      if (res) {
        const json = parseJson(res.text);
        if (json) {
          return { ...json, model: res.model, usage_cost: res.usage_cost, source: "ai" };
        }
      }
    } catch (err) {
      console.warn("[follow-up-draft] ai failed, template fallback:", (err as Error)?.message || err);
    }
  }
  return templateDraft(lead);
}
