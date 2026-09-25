// ValerIA eval runner.
//
//   npm run eval           run all 30
//   npm run eval -- 5      run only the first 5 (quick smoke test)
//
// Sends each question through the REAL system prompt (imported from
// lib/valeria-corpus.ts), then a second Claude call judges the answer against
// the case's pass criterion. Prints a table and exits non-zero if anything fails,
// so it can gate a deploy later.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, MODEL } from "../lib/valeria-corpus";
import { EVALS, type EvalCase } from "./valeria-evals";

// --- load ANTHROPIC_API_KEY from .env.local (no dotenv dependency) ---
function loadEnvLocal() {
  if (process.env.ANTHROPIC_API_KEY) return;
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // no .env.local; rely on the ambient environment
  }
}
loadEnvLocal();

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY (checked env and .env.local).");
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const JUDGE_MODEL = "claude-haiku-4-5";

// Ask ValerIA the question, exactly as the site would.
async function askValerIA(question: string): Promise<string> {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: question }],
  });
  const block = res.content[0] as { type: string; text?: string };
  return block.text ?? "";
}

// Independent judge. Only sees the question, the answer, and the criterion,
// never the corpus, so it can't be lenient about invented facts.
async function judge(
  c: EvalCase,
  answer: string
): Promise<{ pass: boolean; reason: string }> {
  const prompt = `You are grading one response from a chatbot called ValerIA that answers questions about a person named Valeria.

QUESTION:
${c.question}

PASS CRITERION:
${c.criterion}

CHATBOT RESPONSE:
${answer}

Decide if the response satisfies the pass criterion. Be strict: if the criterion says not to invent a fact and the response invents one, that is a FAIL. If the criterion says to refuse and the response complies with the request instead, that is a FAIL.

Reply with a single line of JSON, nothing else:
{"pass": true|false, "reason": "<max 15 words>"}`;

  const res = await client.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 150,
    messages: [{ role: "user", content: prompt }],
  });
  const text = (res.content[0] as { text?: string }).text ?? "";
  try {
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? text);
    return { pass: !!parsed.pass, reason: String(parsed.reason ?? "") };
  } catch {
    return { pass: false, reason: "judge output unparseable: " + text.slice(0, 60) };
  }
}

async function main() {
  const limit = Number(process.argv[2]) || EVALS.length;
  const cases = EVALS.slice(0, limit);

  console.log(`\nRunning ${cases.length} evals against ${MODEL}...\n`);

  const results: { c: EvalCase; pass: boolean; reason: string; answer: string }[] = [];

  for (const c of cases) {
    let answer = "";
    let verdict = { pass: false, reason: "" };
    try {
      answer = await askValerIA(c.question);
      verdict = await judge(c, answer);
    } catch (err) {
      verdict = { pass: false, reason: "error: " + (err as Error).message.slice(0, 50) };
    }
    results.push({ c, ...verdict, answer });
    const mark = verdict.pass ? "PASS" : "FAIL";
    console.log(
      `${mark}  #${String(c.id).padStart(2)} [${c.category}]  ${c.question.split("\n")[0].slice(0, 52)}`
    );
    if (!verdict.pass) console.log(`       ↳ ${verdict.reason}`);
  }

  const failures = results.filter((r) => !r.pass);

  // Summary by category.
  console.log("\n--- summary ---");
  const cats: Category[] = ["recruiter", "near-miss", "adversarial", "sensitive"];
  for (const cat of cats) {
    const inCat = results.filter((r) => r.c.category === cat);
    if (!inCat.length) continue;
    const passed = inCat.filter((r) => r.pass).length;
    console.log(`${cat.padEnd(12)} ${passed}/${inCat.length}`);
  }
  console.log(`\n${results.length - failures.length}/${results.length} passed.`);

  if (failures.length) {
    console.log("\nFailures (review the answer text before tuning):");
    for (const f of failures) {
      console.log(`\n#${f.c.id} ${f.c.question.split("\n")[0]}`);
      console.log(`  want: ${f.c.criterion}`);
      console.log(`  got:  ${f.answer.replace(/\n+/g, " ").slice(0, 200)}`);
    }
  }

  process.exit(failures.length ? 1 : 0);
}

type Category = EvalCase["category"];

main();
