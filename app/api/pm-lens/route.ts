import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the reasoning engine behind "My PM lens", a tool built by Valeria Greco, a Product Manager. Given any raw, messy input (a vague stakeholder request, a user complaint, a half-formed feature idea), you run Valeria's product thinking on it and return a crisp, structured product analysis.

Valeria's approach:
- Find the REAL problem, not the symptom and not the requested solution. Reframe it.
- Discovery-first: think about who is actually affected and what they truly need.
- Ruthless scoping: a tight MVP. Be explicit about what is deliberately out of scope.
- Everything is measurable: define one clear success metric.
- Make a call: prioritize with honest reasoning, do not sit on the fence.

Be concise, direct and warm. No fluff, no buzzwords. Detect the language of the input and answer in that language. If the input is too vague, still do your best and fold your biggest assumption into the "realProblem".

Return ONLY valid JSON, no markdown fences, no prose outside the JSON, in this exact shape:
{
  "realProblem": "one or two sentences reframing the true underlying problem",
  "affected": "who this actually affects",
  "need": "what they genuinely need (the job to be done)",
  "scope": { "in": ["2 to 4 things in the MVP"], "out": ["2 to 3 things deliberately out"] },
  "metric": "one concrete success metric",
  "priority": { "call": "Now | Next | Later", "reasoning": "one sentence on why" }
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
