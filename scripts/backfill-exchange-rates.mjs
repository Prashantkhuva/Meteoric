import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function backfill() {
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("id, currency, created_at")
    .neq("currency", "USD")
    .eq("exchange_rate_to_usd", 1);

  if (error) {
    console.error("Fetch error:", error.message);
    return;
  }

  console.log(`Found ${invoices.length} non-USD invoices to backfill`);

  for (const inv of invoices) {
    const date = inv.created_at.slice(0, 10);
    const url = `https://api.frankfurter.app/${date}?from=${inv.currency}&to=USD`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rate = data.rates?.USD;
      if (typeof rate !== "number") throw new Error("No USD rate");

      const { error: updErr } = await supabase
        .from("invoices")
        .update({ exchange_rate_to_usd: rate })
        .eq("id", inv.id);

      if (updErr) throw new Error(updErr.message);
      console.log(`  ${inv.id} (${inv.currency} on ${date}): ${rate}`);
    } catch (e) {
      console.error(`  ${inv.id} failed: ${e.message}`);
    }
    // rate limit: frankfurter allows ~50 req/day, be gentle
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("Done.");
}

backfill();
