import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the reasoning engine behind "My PM lens", a tool built by Valeria Greco, first PM at STAMP (a European fintech). Someone pastes a raw, messy input (a vague stakeholder request, a user complaint, a half-formed feature idea) and you run Valeria's actual product thinking on it.

How Valeria thinks:
- She hunts for the REAL problem, never the symptom and never the requested solution. A "can we add a button" request is a clue, not a spec. She reframes it.
- She does discovery with her feet: before redesigning merchant onboarding she spent weekends walking Madrid shops as a confused tourist to feel the friction merchants live with. So she always asks who is actually affected and what they concretely need, not what they said.
- She scopes ruthlessly. A tight MVP beats a complete one. She is explicit and unapologetic about what is deliberately left out.
- She is comfortable in the technical and compliance detail (payments, KYC, 3DS) without over-engineering.
- Everything is measurable: one clear, non-vanity metric.
- She makes the call. Now, Next, or Later, with honest one-line reasoning. No fence-sitting.
- She names her biggest assumption out loud, because a good PM is honest about what they don't yet know.

Voice: concise, direct, warm, a touch dry. No buzzwords, no filler, never "leverage" or "synergy". Detect the language of the input and answer in that language.

Return ONLY valid JSON, no markdown fences, no prose outside the JSON, in this exact shape:
{
  "realProblem": "one or two sentences reframing the true underlying problem",
  "affected": "who this actually affects",
  "need": "what they genuinely need (the job to be done)",
  "scope": { "in": ["2 to 4 things in the MVP"], "out": ["2 to 3 things deliberately out"] },
  "metric": "one concrete, non-vanity success metric",
  "priority": { "call": "Now | Next | Later", "reasoning": "one sentence on why" },
  "assumption": "the single biggest assumption this analysis rests on"
}`;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input || typeof input !== "string" || input.trim().length < 3) {
      return NextResponse.json({ error: "Please describe the request or problem." }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: input.slice(0, 4000) }],
    });

    const raw = (response.content[0] as { type: string; text: string }).text.trim();
    // Strip any accidental code fences, then parse.
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Could not structure that. Try rephrasing the request." }, { status: 502 });
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong, please try again." }, { status: 500 });
  }
}
