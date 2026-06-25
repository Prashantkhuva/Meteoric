import { GoogleGenerativeAI } from "@google/generative-ai";

const PROVIDER = process.env.AI_PROVIDER || "google";
let genAI = null;
if (PROVIDER === "google" && process.env.GOOGLE_API) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
}

const MODEL = process.env.AI_MODEL || "gemini-1.5-flash";

function getModel() {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 256,
    },
  });
}

export async function callAI(systemPrompt, userContent) {
  const model = getModel();
  if (!model) return null;

  const result = await model.generateContent({
    contents: [
      { role: "user", parts: [{ text: `${systemPrompt}\n\n${userContent}` }] },
    ],
  });

  const text = result.response?.text?.()?.trim();
  return text || null;
}

export async function callAIJson(systemPrompt, userContent) {
  const model = getModel();
  if (!model) return null;

  const result = await model.generateContent({
    contents: [
      { role: "user", parts: [{ text: `${systemPrompt}\n\n${userContent}` }] },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 256,
    },
  });

  const text = result.response?.text?.()?.trim();
  if (!text) return null;

  try {
    const cleaned = text.replace(/```(json)?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    console.warn("[ai] failed to parse JSON response:", text.slice(0, 200));
    return null;
  }
}
