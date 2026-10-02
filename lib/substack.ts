// Live reader for Valeria's Substack — the self-updating half of ValerIA's brain.
// The chat route calls getPosts() on each request; Next caches the feed for an
// hour (revalidate below), so a new post shows up on its own within ~1h, no
// command to run. If the live fetch ever fails, we fall back to the snapshot
// committed in lib/corpus/writing.json (last successful `npm run ingest`).

import snapshot from "./corpus/writing.json";

export type Post = {
  title: string;
  link: string;
  date: string | null;
  body: string;
};

export const SUBSTACK_URL = "https://leragreco.substack.com";
const FEED_URL = `${SUBSTACK_URL}/feed`;
const CACHE_SECONDS = 3600; // re-read the feed at most once an hour
const MAX_CHARS_PER_POST = 2200;

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&amp;/g, "&");
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<\/(p|div|h\d|li|br)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decodeEntities(m[1]).trim() : "";
}

function parseFeed(xml: string): Post[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return items.map((block) => {
    const title = stripHtml(pick(block, "title"));
    const link = pick(block, "link").replace(/\?.*$/, "");
    const pubDate = pick(block, "pubDate");
    const date = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : null;
    const rawBody = pick(block, "content:encoded") || pick(block, "description");
    let body = stripHtml(rawBody);
    if (body.length > MAX_CHARS_PER_POST) {
      body = body.slice(0, MAX_CHARS_PER_POST).replace(/\s+\S*$/, "") + "…";
    }
    return { title, link, date, body };
  });
}

// Live posts, cached by Next for CACHE_SECONDS. Falls back to the committed
// snapshot if the feed can't be read, so ValerIA never goes blank.
export async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(FEED_URL, {
      headers: { "User-Agent": "ValerIA-brain/1.0 (+https://leragreco.com)" },
      next: { revalidate: CACHE_SECONDS },
    });
    if (!res.ok) throw new Error(`feed HTTP ${res.status}`);
    const posts = parseFeed(await res.text());
    if (posts.length === 0) throw new Error("feed had no items");
    return posts;
  } catch (err) {
    console.error("[substack] live fetch failed, using snapshot:", err);
    return (snapshot.posts as Post[]) ?? [];
  }
}
