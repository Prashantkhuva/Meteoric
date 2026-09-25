import { VALID_LEAD_STATUSES } from "../admin-validation.js";

const TAG_RE = /<[^>]*>/g;

function stripControlChars(text) {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0);
    out += code >= 32 && code !== 127 ? ch : " ";
  }
  return out;
}

export function sanitizeText(value, maxLength) {
  if (value == null) return "";
  let text = stripControlChars(String(value).replace(TAG_RE, " "))
    .replace(/\s+/g, " ")
    .trim();
  if (text.length > maxLength) text = text.slice(0, maxLength);
  return text;
}

export function buildState(lead) {
  return {
    name: sanitizeText(lead?.name, 200),
    email: sanitizeText(lead?.email, 254),
    company: sanitizeText(lead?.company, 200),
    services: sanitizeText(lead?.services, 200),
    budget: sanitizeText(lead?.budget, 100),
    details: sanitizeText(lead?.details, 1500),
    source: sanitizeText(lead?.source, 50),
    current_status: sanitizeText(lead?.status, 50),
  };
}

export const TRIAGE_QUESTIONS = {
  quality: {
    type: "choice",
    instructions: "How would you classify this inbound sales lead?",
    criteria: {
      hot: "Strong buying intent: clear project, budget, and timeline.",
      warm: "Real interest but missing budget, timeline, or scope.",
      cold: "Vague inquiry, price shopping, or no near-term need.",
      spam: "Advertising, scams, irrelevant, or nonsense content.",
    },
  },
  suggested_next_status: {
    type: "choice",
    instructions: "Which pipeline stage should this lead move to next?",
    criteria: {
      inquiry: "New inbound contact not yet qualified.",
      discovery: "Worth a scoping call; needs qualification.",
      proposal: "Qualified with clear scope and intent to buy.",
      lost: "Not a viable opportunity; should exit the pipeline.",
    },
  },
  service_category: {
    type: "choice",
    instructions: "Which service category does this lead need most?",
    criteria: {
      web: "Marketing site, landing page, or static web work.",
      saas: "SaaS product, dashboard, or web application development.",
      mobile: "Mobile app development.",
      other: "Does not fit the other categories.",
    },
  },
};

export function isValidStatusChoice(choice) {
  return VALID_LEAD_STATUSES.includes(choice);
}
