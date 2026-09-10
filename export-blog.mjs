import fs from 'fs';
import path from 'path';
import { blogPosts } from './src/data/blog-posts.js';

const outDir = 'blog-export';
fs.mkdirSync(outDir, { recursive: true });

for (const post of blogPosts) {
  const desc = post.description || '';
  const authorName = typeof post.author === 'object' ? post.author.name : (post.author || 'Prashant Khuva');

  // Frontmatter with ALL metadata
  const frontmatter = [
    '---',
    `title: "${post.title}"`,
    `slug: "${post.slug}"`,
    `author: "${authorName}"`,
    `published: "${post.published}"`,
    `dateModified: "${post.dateModified}"`,
    `category: "${post.category || 'Engineering'}"`,
    `tags: [${(post.tags || []).map(t => `"${t}"`).join(', ')}]`,
    `description: "${desc.replace(/"/g, '\\"')}"`,
    `meta_description: "${desc.replace(/"/g, '\\"')}"`,
    `image: "${post.image || ''}"`,
    `readTime: "${post.readTime || ''}"`,
    '---',
    '',
  ].join('\n');

  let body = '';

  // Sections
  if (post.sections) {
    for (const s of post.sections) {
      body += `## ${s.heading}\n\n${s.body}\n\n`;
    }
  }

  // Body field
  if (post.body) {
    body += post.body + '\n\n';
  }

  // Metrics as a table
  if (post.metrics && post.metrics.length > 0) {
    body += '## Key Metrics\n\n';
    body += '| Metric | Value |\n|--------|-------|\n';
    for (const m of post.metrics) {
      body += `| ${m.label} | ${m.value} |\n`;
    }
    body += '\n';
  }

  // Related blog posts as internal links
  if (post.relatedBlogPosts && post.relatedBlogPosts.length > 0) {
    body += '## Related Articles\n\n';
    for (const rp of post.relatedBlogPosts) {
      body += `- [${rp.title}](/${rp.slug})\n`;
    }
    body += '\n';
  }

  // Further reading as external links
  if (post.furtherReading && post.furtherReading.length > 0) {
    body += '## Further Reading\n\n';
    for (const fr of post.furtherReading) {
      body += `- [${fr.title}](${fr.url}) — ${fr.source}\n`;
    }
    body += '\n';
  }

  // Related links
  if (post.relatedLinks && post.relatedLinks.length > 0) {
    body += '## Additional Resources\n\n';
    for (const rl of post.relatedLinks) {
      body += `- [${rl.title}](${rl.url})\n`;
    }
    body += '\n';
  }

  // FAQs
  if (post.faqs && post.faqs.length > 0) {
    body += '## Frequently Asked Questions\n\n';
    for (const faq of post.faqs) {
      body += `### ${faq.question}\n\n${faq.answer}\n\n`;
    }
  }

  // HowTo
  if (post.howTo && post.howTo.steps && post.howTo.steps.length > 0) {
    body += `## ${post.howTo.title || 'Step-by-Step Guide'}\n\n`;
    body += `${post.howTo.description || ''}\n\n`;
    for (let i = 0; i < post.howTo.steps.length; i++) {
      const step = post.howTo.steps[i];
      body += `### Step ${i + 1}: ${step.name}\n\n${step.text}\n\n`;
    }
  }

  fs.writeFileSync(path.join(outDir, post.slug + '.md'), frontmatter + body);
}

console.log(`Exported ${blogPosts.length} posts with full metadata`);
