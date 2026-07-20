import { GoogleGenerativeAI } from "@google/generative-ai";

const PROVIDER = process.env.AI_PROVIDER || "google";
let genAI = null;
if (PROVIDER === "google" && process.env.GOOGLE_API) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
}

const MODEL = process.env.AI_MODEL || "gemini-2.0-flash";
const TIMEOUT_MS = 10_000;

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

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`AI timeout after ${ms}ms`)), ms)
    ),
  ]);
}

export async function callAIJson(systemPrompt, userContent) {
  const model = getModel();
  if (!model) return null;

  const result = await withTimeout(
    model.generateContent({
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userContent}` }] },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 256,
      },
    }),
    TIMEOUT_MS,
  );

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
