import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("missing supabase url/service key");
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/notifications`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify({
    type: "new_lead",
    title: "Test notification",
    body: "End-to-end check: lead pipeline is working.",
    entity_type: "lead",
    dedupe_key: `test:${Date.now()}`,
  }),
});

const body = await res.text();
console.log(res.status, body.slice(0, 300));
