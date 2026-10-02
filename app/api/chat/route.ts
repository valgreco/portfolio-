import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { buildSystemPrompt, MODEL } from "@/lib/valeria-corpus";
import { getPosts } from "@/lib/substack";
import { retrieve } from "@/lib/retrieve";

export const runtime = "nodejs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const lastUser =
    [...messages].reverse().find((m: { role: string }) => m.role === "user")?.content ?? "";

  // Real retrieval step over her writing — surfaced to the UI as "the machinery".
  const posts = await getPosts();
  const sources = retrieve(lastUser, posts);

  const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));
  const system = await buildSystemPrompt();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        send({ type: "sources", posts: sources });

        const ms = client.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system,
          messages: anthropicMessages,
        });
        ms.on("text", (t) => send({ type: "delta", text: t }));
        await ms.finalMessage();

        send({ type: "done" });
      } catch (err) {
        console.error(err);
        send({ type: "error", text: "Something went wrong, please try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
