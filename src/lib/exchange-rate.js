const rateCache = new Map();

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
