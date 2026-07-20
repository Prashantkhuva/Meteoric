const rateCache = new Map();
let lastBackfillDate = null;

function dateKey(d) {
  return d instanceof Date ? d.toISOString().slice(0, 10) : d;
}

export async function getExchangeRate(fromCurrency, date) {
  const cur = (fromCurrency || "USD").toUpperCase();
  if (cur === "USD") return 1;

  const key = `${cur}:${dateKey(date)}`;
  if (rateCache.has(key)) return rateCache.get(key);

  const targetDate = dateKey(date);
  const url = `https://api.frankfurter.app/${targetDate}?from=${cur}&to=USD`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`FX API ${res.status}`);
    const data = await res.json();
    const rate = data.rates?.USD;
    if (typeof rate !== "number") throw new Error("No USD rate");
    rateCache.set(key, rate);
    return rate;
  } catch {
    return 1;
  }
}

export async function backfillMissingRates(supabase, invoices) {
  const today = dateKey(new Date());
  if (lastBackfillDate === today) return invoices;

  const missing = invoices.filter(
    (inv) => inv.currency !== "USD" && Number(inv.exchange_rate_to_usd) === 1
  );
  if (!missing.length) {
    lastBackfillDate = today;
    return invoices;
  }

  const updated = [...invoices];
  for (const inv of missing) {
    const rate = await getExchangeRate(inv.currency, inv.created_at);
    if (rate !== 1) {
      await supabase
        .from("invoices")
        .update({ exchange_rate_to_usd: rate })
        .eq("id", inv.id);
      const idx = updated.findIndex((i) => i.id === inv.id);
      if (idx !== -1) updated[idx] = { ...updated[idx], exchange_rate_to_usd: rate };
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  lastBackfillDate = today;
  return updated;
}
