import { readFileSync } from "node:fs";

const ref = "hlxjljckxthmtssqrzwo";
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error("SUPABASE_ACCESS_TOKEN missing");
  process.exit(1);
}

const sql = readFileSync(
  new URL("../supabase/migrations/20260824000001_create_notifications.sql", import.meta.url),
  "utf8",
);

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

const body = await res.text();
console.log(res.status, body.slice(0, 500));
process.exit(res.ok ? 0 : 1);
