export default {
  async fetch(request, env) {
    const manifestUrl = `${env.SUPABASE_URL}/storage/v1/object/public/app-releases/latest.json`;

    let manifest;
    try {
      const res = await fetch(manifestUrl);
      if (!res.ok) {
        return new Response("Update manifest unavailable", { status: 502 });
      }
      manifest = await res.json();
    } catch {
      return new Response("Failed to fetch update manifest", { status: 502 });
    }

    const { url } = manifest;
    if (!url) {
      return new Response("No download available", { status: 404 });
    }

    return Response.redirect(url, 302);
  },
};
