import { marked } from 'marked';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string; // rendered HTML
  rawContent: string; // original markdown
}

// Minimal YAML-frontmatter parser — handles only string key: value pairs,
// which is all we need. Zero dependencies, browser-safe.
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, content: match[2] };
}

// Vite loads all .md files from /posts as raw strings at build time.
// To add a new post: create posts/YYYY-MM-title.md with frontmatter.
const modules = import.meta.glob('/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const allPosts: BlogPost[] = Object.entries(modules)
  .map(([, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    return {
      slug: data.slug ?? '',
      title: data.title ?? 'Untitled',
      date: data.date ?? '',
      summary: data.summary ?? '',
      rawContent: content,
      content: marked.parse(content) as string,
    };
  })
  // Newest first — sort by the date string from frontmatter
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find(p => p.slug === slug);
}
