# leragreco.com

My portfolio — and a working sample of how I build with AI. I'm a product manager; I built this myself with Claude Code, no developer. The interesting parts aren't the pages, they're the systems behind them.

**Live:** [leragreco.com](https://leragreco.com)

## What's worth a look

### ValerIA — an AI agent you can talk to
A retrieval-augmented agent that answers questions about me, grounded in my **real writing** rather than a hand-typed FAQ.

- **Live retrieval** over my Substack essays (`lib/substack.ts`, `lib/retrieve.ts`): on each question it scores my posts for relevance and grounds the answer in the matching ones, with citations. New posts are picked up within the hour — no redeploy.
- **Streaming** responses over NDJSON (`app/api/chat/route.ts`), so the UI shows the machinery live: *reading → scanning essays → found in \[post] → writing*.
- **Guardrails + a curated source of truth** (`lib/valeria-corpus.ts`) so she never invents facts.
- **Evals as regression tests** (`evals/`): 30 question/criterion pairs written before tuning. Every prompt change runs against them (`npm run eval`).
- **Observability** (`lib/observability.ts`, `/valeria/ops`): every production question is logged with whether my writing grounded it. Ungrounded questions are content gaps — what to write next — and feed new evals. The deploy → measure → diagnose → improve loop, live.

### My PM lens
Paste a fuzzy request and watch it become a scoped product decision — the real problem, who it affects, a tight scope, a metric, a call. A Claude route with a system prompt that encodes how I actually do product (`app/api/pm-lens`, `components/PMLens.tsx`).

### Roadmap tool
An interactive recreation of the timeline/Gantt roadmap I built and run at STAMP: initiatives as bars on a sprint calendar, owners, themes, statuses, drag-to-reschedule, add-item, and a Jira-sync affordance. Placeholder data only (`components/RoadmapDemo.tsx`).

## Stack

- **Next.js (App Router) + React + TypeScript**, Tailwind CSS v4
- **Anthropic Claude** for ValerIA and the PM lens
- **Upstash Redis** for observability logging
- **framer-motion** for motion, **cobe** for the career globe
- **Vercel** for hosting + Analytics

## Running it

```bash
npm install
cp .env.example .env.local   # fill in what you want to exercise
npm run dev
```

Everything degrades gracefully: without keys, ValerIA and the PM lens are the only things that go quiet — the rest of the site works. See `.env.example` for the variables.

```bash
npm run eval     # run ValerIA's eval suite
npm run ingest   # refresh the committed Substack snapshot
```
