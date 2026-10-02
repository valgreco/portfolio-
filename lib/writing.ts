// ValerIA's "brain": Valeria's real writing, read live from Substack
// (lib/substack.ts) with an hourly cache and a committed-snapshot fallback.
// If there are no posts, ValerIA simply falls back to the curated corpus —
// nothing breaks.

import { getPosts, SUBSTACK_URL, type Post } from "./substack";

export type { Post };

// Formats the posts into a block ValerIA can ground its answers in.
export async function writingContext(): Promise<string> {
  const posts = await getPosts();
  if (posts.length === 0) return "";

  const formatted = posts
    .map((p, i) => {
      const header = `[${i + 1}] "${p.title}"${p.date ? ` (${p.date})` : ""} — ${p.link}`;
      return `${header}\n${p.body}`;
    })
    .join("\n\n---\n\n");

  return `

VALERIA'S OWN WRITING (from her Substack, ${SUBSTACK_URL}):
The following are excerpts from essays Valeria has actually published. When a question
touches something she has written about, ground your answer in these words — reflect her
real voice, opinions and examples — and point the reader to the post by its title and link.
Do not invent posts or quotes that aren't here. If her writing doesn't cover the question,
answer from the facts above and say it's your read of how she thinks.

${formatted}`;
}
