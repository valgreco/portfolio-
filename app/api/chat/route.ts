import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, MODEL } from "@/lib/valeria-corpus";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: await buildSystemPrompt(),
      messages: anthropicMessages,
    });

    const reply = (response.content[0] as { type: string; text: string }).text;
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ reply: "Something went wrong, please try again." }, { status: 500 });
  }
}
