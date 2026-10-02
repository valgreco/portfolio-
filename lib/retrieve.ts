// Lightweight, honest retrieval over Valeria's writing. Scores each post by
// term overlap with the question and returns the most relevant ones, so the
// chat can show *which* essays actually ground an answer. Not embeddings (that's
// Phase 2) — but a real retrieval step, not theatre.

import type { Post } from "./substack";

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are", "was",
  "be", "it", "this", "that", "with", "as", "at", "by", "from", "but", "not", "so",
  "what", "how", "why", "when", "where", "who", "does", "do", "did", "can", "could",
  "would", "should", "about", "i", "you", "she", "he", "her", "his", "they", "them",
  "we", "me", "my", "your", "their", "our", "has", "have", "had", "think", "thinks",
  "tell", "say", "says", "valeria", "lera", "greco",
]);

function tokenize(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP.has(w))
    )
  );
}

export type Source = { title: string; link: string };

export function retrieve(query: string, posts: Post[], max = 2): Source[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const scored = posts
    .map((p) => {
      const title = p.title.toLowerCase();
      const body = p.body.toLowerCase();
      let score = 0;
      let matched = 0; // distinct query terms that appear in this post
      let titleHit = false;
      for (const t of terms) {
        const inBody = body.split(t).length - 1;
        const inTitle = title.includes(t);
        if (inTitle) {
          score += 1.5;
          titleHit = true;
        }
        if (inBody > 0) score += 1 + Math.min(inBody, 3) * 0.25;
        if (inBody > 0 || inTitle) matched += 1;
      }
      return { p, score, matched, titleHit };
    })
    // Only cite a post on a real match — several overlapping terms, or the
    // title itself. A single stray word shouldn't claim an essay grounded it.
    .filter((x) => x.matched >= 2 || x.titleHit)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, max).map((x) => ({ title: x.p.title, link: x.p.link }));
}
