const TAG_RE = /<[^>]*>/g;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "10minutemail.net",
  "yopmail.com",
  "trashmail.com",
  "trashmail.net",
  "sharklasers.com",
  "getnada.com",
  "maildrop.cc",
  "discard.email",
  "throwawaymail.com",
]);

const AD_PATTERNS = [
  /buy\s+(followers|likes|subscribers|views)/i,
  /seo\s+service[s]?\s+(guaranteed|guarantee)/i,
  /\b(casino|gambling|payday\s+loan)\b/i,
  /cheap\s+(traffic|backlinks)\b/i,
];

function readableChars(text: string) {
  let letters = 0;
  let total = 0;
  for (const ch of text) {
    if (/\s/.test(ch)) continue;
    total++;
    if (/[a-zA-Z]/.test(ch)) letters++;
  }
  return { letters, total };
}

export function looksLikeSpam(lead: Record<string, any>): { spam: boolean; reasons: string[] } {
  const reasons: string[] = [];

  const email = String(lead?.email || "").trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at > 0) {
    const domain = email.slice(at + 1);
    if (DISPOSABLE_DOMAINS.has(domain)) reasons.push(`disposable email domain: ${domain}`);
  }

  const clean = (v: unknown) =>
    String(v || "").replace(TAG_RE, " ").replace(/\s+/g, " ").trim();
  const details = clean(lead?.details);
  const services = clean(lead?.services);
  const budget = clean(lead?.budget);

  if (details.length < 20 && !services && !budget) {
    reasons.push("details too short and no services/budget");
  }

  if (details.length > 0) {
    const { letters, total } = readableChars(details);
    if (total >= 10 && letters / total < 0.2) {
      reasons.push("details are mostly digits/symbols");
    }
    const urls = details.match(/https?:\/\/\S+/g) || [];
    const withoutUrls = details.replace(/https?:\/\/\S+/g, " ").trim();
    if (urls.length >= 1 && withoutUrls.length < 15) {
      reasons.push("details are link-only");
    }
  }

  for (const re of AD_PATTERNS) {
    if (re.test(details) || re.test(services)) {
      reasons.push(`ad pattern matched: ${re.source}`);
      break;
    }
  }

  return { spam: reasons.length > 0, reasons };
}
