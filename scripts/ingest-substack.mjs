// Ingests Valeria's Substack into the ValerIA "brain".
//
// Usage:
//   node scripts/ingest-substack.mjs https://yourpublication.substack.com
//   (a bare subdomain works too, e.g. `node scripts/ingest-substack.mjs yourpublication`)
//
// It reads the public RSS feed, extracts each post's title, link, date and text,
// and writes them to lib/corpus/writing.json. ValerIA then answers grounded in
// what Valeria has actually written, citing the post. Re-run it whenever she
// publishes something new — that's how the brain grows.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "lib", "corpus", "writing.json");

// How much of each post to keep. Enough for ValerIA to quote and reason from,
// without blowing up the prompt. Bump this (and move to real RAG) when the
// corpus gets large — see Phase 2.
const MAX_CHARS_PER_POST = 2200;

function resolveFeedUrl(arg) {
  if (!arg) return null;
  let base = arg.trim();
  // Allow a bare subdomain like "leragreco".
  if (!base.includes(".") && !base.includes("/")) {
    base = `https://${base}.substack.com`;
  }
  if (!/^https?:\/\//.test(base)) base = `https://${base}`;
  base = base.replace(/\/+$/, "");
  // Point at the feed unless they already gave us one.
  if (!base.endsWith("/feed")) base = `${base}/feed`;
  return base;
}

function decodeEntities(s) {
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

function stripHtml(html) {
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

function pick(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decodeEntities(m[1]).trim() : "";
}

async function main() {
  const feedUrl = resolveFeedUrl(process.argv[2]);
  if (!feedUrl) {
    console.error(
      "\n  Give me your Substack URL. For example:\n" +
        "    node scripts/ingest-substack.mjs https://yourpublication.substack.com\n"
    );
    process.exit(1);
  }

  console.log(`\n  Reading ${feedUrl} ...`);
  const res = await fetch(feedUrl, {
    headers: { "User-Agent": "ValerIA-brain/1.0 (+https://leragreco.com)" },
  });
  if (!res.ok) {
    console.error(`\n  Couldn't read the feed (HTTP ${res.status}). Double-check the URL.\n`);
    process.exit(1);
  }
  const xml = await res.text();

  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  if (items.length === 0) {
    console.error("\n  No posts found in that feed. Is the URL right?\n");
    process.exit(1);
  }

  const posts = items.map((block) => {
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

  const out = {
    source: feedUrl.replace(/\/feed$/, ""),
    fetchedAt: new Date().toISOString(),
    posts,
  };

  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`\n  ✓ Ingested ${posts.length} post(s) into lib/corpus/writing.json`);
  posts.forEach((p) => console.log(`    · ${p.date ?? "????-??-??"}  ${p.title}`));
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
