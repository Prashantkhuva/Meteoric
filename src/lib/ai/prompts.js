const SCORE_SYSTEM = `Score this lead 0-100 based on: detail quality (0-30), budget signal (0-25), service clarity (0-25), professionalism (0-20). Return JSON: {"score":int,"category":"hot|warm|cold|spam","summary":"<12 words"}. Low score if vague or spam.`;

export function scoreLeadPrompt(lead) {
  const fields = [lead.name, lead.email, lead.company, lead.services, lead.budget, lead.details]
    .filter(Boolean)
    .join(" | ");
  return { system: SCORE_SYSTEM, user: fields };
}

const REVIEW_SYSTEM = `Analyze this client review. Return JSON: {"is_spam":bool,"score":0-100,"reason":"<10 words"}. Flag as spam if gibberish, profanity, or promotional links. Auto-approve if score >= 60. Keep it brief.`;

export function reviewModerationPrompt(review) {
  const content = [review.name, review.company, review.content, review.rating].filter(Boolean).join(" | ");
  return { system: REVIEW_SYSTEM, user: content };
}

const PROPOSAL_SYSTEM = `Generate a proposal draft in JSON. Keep it brief — max 3 pricing items. Return JSON: {"title":"<project type>","content":"<2-3 sentence scope>","pricing":[{"description":"<service>","quantity":1,"rate":500}],"timeline":"<duration>","terms":"Standard 50% deposit, net 30"}. Use realistic rates.`;

export function proposalDraftPrompt(lead) {
  const info = [
    lead.name && `Client: ${lead.name}`,
    lead.company && `Company: ${lead.company}`,
    lead.services && `Services: ${lead.services}`,
    lead.budget && `Budget: ${lead.budget}`,
    lead.details && `Details: ${lead.details}`,
  ].filter(Boolean).join("\n");

  return { system: PROPOSAL_SYSTEM, user: info };
}
