import { LEARNING_CURRICULUM } from "@/lib/learning/curriculum";
import type { RagSource } from "@/lib/learning/coach-types";

export type RagChunk = RagSource & {
  text: string;
};

export function buildRagCorpus(): RagChunk[] {
  const chunks: RagChunk[] = [];

  for (const phase of LEARNING_CURRICULUM) {
    chunks.push({
      id: `phase-${phase.id}`,
      kind: "week",
      title: `Phase ${phase.number}: ${phase.title}`,
      text: `${phase.title}. Weeks ${phase.weekRange[0]}–${phase.weekRange[1]}. ${phase.description}`,
    });

    for (const week of phase.weeks) {
      chunks.push({
        id: `week-${week.id}`,
        kind: "week",
        title: `Week ${week.weekNumber}: ${week.title}`,
        text: [
          `Week ${week.weekNumber} ${week.title}.`,
          `Focus: ${week.focus}.`,
          `Daily split: ${week.dailySplit}.`,
          `Topics: ${week.topics.join(", ")}.`,
          `Tasks: ${week.tasks.map((t) => t.title).join("; ")}.`,
        ].join(" "),
      });

      for (const resource of week.resources) {
        chunks.push({
          id: `res-${week.id}-${resource.url}`,
          kind: "resource",
          title: resource.title,
          url: resource.url,
          text: `Week ${week.weekNumber} ${week.title}. ${resource.type}: ${resource.title}. Topics: ${week.topics.join(", ")}. ${week.focus}`,
        });
      }
    }
  }

  chunks.push(...KNOWLEDGE_CHUNKS);
  return chunks;
}

const KNOWLEDGE_CHUNKS: RagChunk[] = [
  {
    id: "k-event-loop",
    kind: "knowledge",
    title: "JavaScript event loop",
    url: "https://javascript.info/event-loop",
    text: "Event loop, call stack, microtasks (promises, queueMicrotask) vs macrotasks (setTimeout, I/O). Jake Archibald In The Loop. Interview staple for senior frontend.",
  },
  {
    id: "k-react-fiber",
    kind: "knowledge",
    title: "React Fiber and rendering",
    url: "https://react.dev/learn/escape-hatches",
    text: "React render vs commit, Fiber, keys, reconciliation, memo, useMemo, useCallback, Server Components vs Client Components, useEffect pitfalls.",
  },
  {
    id: "k-http-security",
    kind: "knowledge",
    title: "HTTP caching and web security",
    url: "https://web.dev/learn/performance",
    text: "Cache-Control, ETag, CDN, CORS preflight, cookies SameSite, XSS, CSRF, CSP, OWASP Top 10, Core Web Vitals.",
  },
  {
    id: "k-node-nest",
    kind: "knowledge",
    title: "Node.js and NestJS APIs",
    url: "https://docs.nestjs.com/",
    text: "Node event loop phases, streams, worker threads, REST design, JWT vs sessions, OAuth2, RBAC, NestJS modules DI guards interceptors, idempotency.",
  },
  {
    id: "k-postgres",
    kind: "knowledge",
    title: "PostgreSQL and Redis",
    url: "https://use-the-index-luke.com/",
    text: "B-tree indexes, EXPLAIN ANALYZE, isolation levels, MVCC, N+1, Prisma pooling, Redis cache-aside, rate limiting, BullMQ jobs.",
  },
  {
    id: "k-system-design",
    kind: "knowledge",
    title: "System design building blocks",
    url: "https://github.com/donnemartin/system-design-primer",
    text: "Load balancing, sharding, CAP, queues, capacity estimation. Classic designs: URL shortener, rate limiter, notification system, news feed, chat.",
  },
  {
    id: "k-llm-rag",
    kind: "knowledge",
    title: "LLM, RAG, and agents",
    url: "https://www.anthropic.com/research/building-effective-agents",
    text: "Prompting, structured outputs, function calling, embeddings, chunking, pgvector, RAG vs fine-tune, evals, prompt injection, cost caps, tracing.",
  },
  {
    id: "k-dsa",
    kind: "knowledge",
    title: "NeetCode DSA path",
    url: "https://neetcode.io/practice",
    text: "Arrays hashing, two pointers, sliding window, stacks, linked lists, trees, heaps, backtracking, graphs, 1D DP, 2D DP. Timed 75-minute sets.",
  },
  {
    id: "p-nexttarget",
    kind: "project",
    title: "NextTarget gym coaching platform",
    url: "https://next-target.ir",
    text: "Alireza solo project. Farsi RTL coaching: clients coaches supervisors admins. Next.js NestJS React Native Expo Prisma Postgres Redis BullMQ OpenAI Zarinpal. RBAC, SVG muscle map, AI progress reports.",
  },
  {
    id: "p-javi",
    kind: "project",
    title: "Javi English IELTS SaaS",
    url: "https://javienglish.com",
    text: "Alireza solo project. Multi-tenant IELTS SaaS. Next.js NestJS OpenAI scoring, Whisper FastAPI, Socket.IO, i18n RTL, Zarinpal billing. Strong AI-in-production story.",
  },
  {
    id: "p-azartime",
    kind: "project",
    title: "AzarTime e-commerce",
    url: "https://azartime.com",
    text: "Alireza solo project. Persian luxury watch store. Catalog cart checkout coupons CMS S3 Torob feed abandoned-cart jobs. Good for e-commerce system design.",
  },
  {
    id: "p-skedpal",
    kind: "project",
    title: "Skedpal frontend lead",
    url: "https://skedpal.com",
    text: "Alireza Frontend Lead. Team of 3. AI calendar 10k+ users. WordPress to Next.js 30% faster. jQuery to React 40% smaller bundle. WCAG dark mode. Mentoring and code review.",
  },
];
