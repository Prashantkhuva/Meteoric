import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import {
  getLeadStats,
  searchLeads,
  getRecentLeads,
  getRevenue,
  getProposalStats,
  getOverdueInvoices,
  getClientCount,
} from "@/lib/ai/tools";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API || "",
});

const modelId = process.env.AI_MODEL || "gemini-2.0-flash";
const model = google(modelId);

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const tools = {
      getLeadStats: tool({
        description: "Get total lead count grouped by status (new, inquiry, discovery, proposal, in_progress, completed, lost)",
        parameters: z.object({}),
        execute: getLeadStats,
      }),
      searchLeads: tool({
        description: "Search leads by name, email, or company. Returns up to 10 matches.",
        parameters: z.object({ query: z.string().describe("Search term") }),
        execute: ({ query }) => searchLeads(query),
      }),
      getRecentLeads: tool({
        description: "Get leads from the last N days. Default 7.",
        parameters: z.object({ days: z.number().default(7).describe("Number of days to look back") }),
        execute: ({ days }) => getRecentLeads(days),
      }),
      getRevenue: tool({
        description: "Get invoice revenue totals: total, paid, overdue, pending amounts.",
        parameters: z.object({}),
        execute: getRevenue,
      }),
      getProposalStats: tool({
        description: "Get proposal counts by status (draft, sent, viewed, accepted, rejected).",
        parameters: z.object({}),
        execute: getProposalStats,
      }),
      getOverdueInvoices: tool({
        description: "Get all overdue invoices with client name and amount.",
        parameters: z.object({}),
        execute: getOverdueInvoices,
      }),
      getClientCount: tool({
        description: "Get total number of clients.",
        parameters: z.object({}),
        execute: getClientCount,
      }),
    };

    const result = await generateText({
      model,
      system: `You are the Meteoric admin assistant. Help the user run their agency.
Keep responses very brief — one paragraph or a short list.
Use tools to look up data. If a tool returns nothing useful, say so plainly.
Do not invent numbers. Use $ for currency amounts.
Current date: ${new Date().toLocaleDateString("en-US")}`,
      messages,
      tools,
      maxSteps: 3,
    });

    return new Response(
      JSON.stringify({
        content: result.text,
        toolCalls: result.toolCalls || [],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("[ai/admin] error:", err);
    const message = err.message || "AI assistant unavailable";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
