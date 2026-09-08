import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import { blogPosts } from "@/data/blog-posts";

export async function GET() {
  const items = blogPosts
    .sort((a, b) => new Date(b.published) - new Date(a.published))
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.published).toUTCString()}</pubDate>
      <lastBuildDate>${new Date(post.dateModified || post.published).toUTCString()}</lastBuildDate>
      <category>${post.tags.join("</category>\n      <category>")}</category>
    </item>`,
    )
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME}</title>
    <description>Notes on building products that convert — SaaS development, web performance, and startup tech decisions.</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>contact@withmeteoric.com (${SITE_NAME})</managingEditor>
    <webMaster>contact@withmeteoric.com (${SITE_NAME})</webMaster>
    <copyright>© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</copyright>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
