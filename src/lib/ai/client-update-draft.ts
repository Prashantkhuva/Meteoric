import { callOpenRouterText } from "./openrouter";

export type ClientUpdateDraft = {
  whatsapp: string;
  email: string;
  subject: string;
  model: string | null;
  usage_cost: number | null;
  source: "ai" | "template";
};

function xmlEscape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const SYSTEM_PROMPT = `You draft a short client check-in for Meteoric (web dev agency, founder Prashant Khuva).
Input is XML-tagged client info. Write:
1) whatsapp — 3-5 sentences, warm, no filler, one clear question.
2) email — 2 short paragraphs + sign-off "Best,\nPrashant\nMeteoric · withmeteoric.com".
3) subject — under 8 words, no ALL CAPS, no spam words.

Rules:
- Never invent project facts, deadlines, invoices, or deliverables not given in the input.
- Use only provided fields. If a field is missing, do not mention it.
- Professional but human. No emoji. No exclamation marks.
- Return ONLY strict JSON: {"whatsapp":"...","email":"...","subject":"..."} with no extra keys or prose.`;

function xmlEscapeSafe(s: unknown) {
  return xmlEscape(String(s ?? "").trim());
}

export async function draftClientUpdate(client: {
  name?: string | null;
  company?: string | null;
  email?: string | null;
  status?: string | null;
  notes?: string | null;
  projects?: Array<{ name?: string | null; status?: string | null }> | null;
}): Promise<ClientUpdateDraft> {
  const name = xmlEscapeSafe(client.name || "there");
  const company = xmlEscapeSafe(client.company || "your company");
  const status = xmlEscapeSafe(client.status || "active");
  const notes = xmlEscapeSafe(client.notes);
  const projects = (client.projects || [])
    .slice(0, 5)
    .map((p) => `<project name="${xmlEscapeSafe(p.name)}" status="${xmlEscapeSafe(p.status)}"/>`)
    .join("");

  const userContent = `<client>
<name>${name}</name>
<company>${company}</company>
<status>${status}</status>
${notes ? `<notes>${notes}</notes>` : ""}
${projects ? `<projects>${projects}</projects>` : ""}
</client>`;

  const ai = await callOpenRouterText(SYSTEM_PROMPT, userContent);
  if (ai) {
    try {
      const parsed = JSON.parse(ai.text);
      if (parsed?.whatsapp && parsed?.email && parsed?.subject) {
        return {
          whatsapp: String(parsed.whatsapp),
          email: String(parsed.email),
          subject: String(parsed.subject),
          model: ai.model,
          usage_cost: ai.usage_cost,
          source: "ai",
        };
      }
    } catch {
      /* fall through to template */
    }
  }

  return templateDraft(client);
}

function templateDraft(client: {
  name?: string | null;
  company?: string | null;
  status?: string | null;
}): ClientUpdateDraft {
  const name = client.name?.trim() || "there";
  const company = client.company?.trim() || "";
  const who = company ? `${name} at ${company}` : name;

  return {
    whatsapp: `Hi ${name}, just a quick check-in on our side. Anything you need from us this week? Happy to hop on a short call if that's easier.`,
    email: `Hi ${name},\n\nI wanted to check in and see how things are going${company ? ` at ${company}` : ""}. If there's anything blocking you or new priorities on your side, let me know and we'll sort it out.\n\nBest,\nPrashant\nMeteoric · withmeteoric.com`,
    subject: `Quick check-in — ${company || who}`,
    model: null,
    usage_cost: null,
    source: "template",
  };
}
