// ValerIA observability: log real production questions so Valeria can see what
// people actually ask her agent, where it has no grounding (content gaps), and
// turn those gaps into new writing and new evals. The loop the AI PM role lives on:
// deploy → measure real interactions → diagnose → improve.
//
// Storage is Upstash Redis (set up via Vercel's one-click integration). If it's
// not configured yet, every function no-ops gracefully and the ops page shows
// the design + eval suite instead of live data — nothing breaks.

import { Redis } from "@upstash/redis";

export type LogEntry = {
  ts: number;
  q: string;
  grounded: boolean;
  sources: string[];
};

const LOG_KEY = "valeria:log";
const COUNT_KEY = "valeria:count";
const GROUNDED_KEY = "valeria:grounded";
const MAX = 500;

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

export function isConfigured(): boolean {
  return getRedis() !== null;
}

export async function logQuestion(entry: LogEntry): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.lpush(LOG_KEY, JSON.stringify(entry));
    await r.ltrim(LOG_KEY, 0, MAX - 1);
    await r.incr(COUNT_KEY);
    if (entry.grounded) await r.incr(GROUNDED_KEY);
  } catch {
    // Observability must never break the chat.
  }
}

export type Stats = {
  configured: boolean;
  total: number;
  grounded: number;
  recent: LogEntry[];
};

export async function getStats(limit = 60): Promise<Stats> {
  const r = getRedis();
  if (!r) return { configured: false, total: 0, grounded: 0, recent: [] };
  try {
    const [total, grounded, rawList] = await Promise.all([
      r.get<number>(COUNT_KEY),
      r.get<number>(GROUNDED_KEY),
      r.lrange(LOG_KEY, 0, limit - 1),
    ]);
    const recent: LogEntry[] = (rawList ?? [])
      .map((x) => {
        if (typeof x === "object" && x !== null) return x as LogEntry;
        try {
          return JSON.parse(x as string) as LogEntry;
        } catch {
          return null;
        }
      })
      .filter((x): x is LogEntry => !!x && typeof x.q === "string");
    return { configured: true, total: total ?? 0, grounded: grounded ?? 0, recent };
  } catch {
    return { configured: true, total: 0, grounded: 0, recent: [] };
  }
}
