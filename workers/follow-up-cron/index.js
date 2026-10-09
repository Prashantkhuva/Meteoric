// Fires every 5 minutes and pings the Next.js follow-up reminder route.
// Vercel Hobby limits crons to once/day, so the schedule lives here instead.
const TARGET = "https://withmeteoric.com/api/cron/check-follow-ups";

async function run(env) {
  const res = await fetch(TARGET, {
    headers: {
      Authorization: `Bearer ${env.CRON_SECRET}`,
    },
  });
  const body = await res.text();
  console.log(`follow-up cron -> ${res.status} ${body}`);
  if (!res.ok) {
    throw new Error(`follow-up cron failed: ${res.status}`);
  }
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(run(env));
  },

  // Manual trigger: GET /?secret=<CRON_SECRET>
  async fetch(request, env) {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");
    if (!secret || secret !== env.CRON_SECRET) {
      return new Response("Not found", { status: 404 });
    }
    try {
      await run(env);
      return new Response("ok");
    } catch (err) {
      return new Response(String(err?.message || err), { status: 500 });
    }
  },
};
