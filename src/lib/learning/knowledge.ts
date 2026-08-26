import { LEARNING_CURRICULUM } from "@/lib/learning/curriculum";
import { INTERVIEW_DRILLS, STAR_STORIES } from "@/lib/learning/interview-bank";
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
  chunks.push(
    ...INTERVIEW_DRILLS.map((d) => ({
      id: `drill-${d.id}`,
      kind: "knowledge" as const,
      title: d.question,
      url: d.resourceUrl,
      text: `Interview drill (${d.area}, weeks ${d.weeks.join(",")}): ${d.question} Talking points: ${d.talkingPoints.join("; ")}. Resource: ${d.resourceTitle} ${d.resourceUrl}`,
    }))
  );
  chunks.push(
    ...STAR_STORIES.map((s) => ({
      id: `star-${s.id}`,
      kind: "project" as const,
      title: `STAR: ${s.title}`,
      text: `${s.title}. S: ${s.situation} T: ${s.task} A: ${s.action} R: ${s.result} Cue: ${s.interviewCue}`,
    }))
  );
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
    id: "k-testing-ci",
    kind: "knowledge",
    title: "Testing and CI for senior frontend/backend",
    url: "https://testing-library.com/docs/react-testing-library/intro/",
    text: "Testing pyramid, RTL, MSW, e2e smoke, GitHub Actions lint typecheck test build. Senior signal: you prevent regressions, not just write tests.",
  },
  {
    id: "k-observability",
    kind: "knowledge",
    title: "Observability for NestJS SaaS",
    url: "https://opentelemetry.io/docs/",
    text: "Logs metrics traces. Correlation ids on webhooks. Alert on error rate and queue lag, not CPU. Token spend dashboards for AI features.",
  },
  {
    id: "k-typescript-extra",
    kind: "knowledge",
    title: "TypeScript at the API boundary",
    url: "https://zod.dev/",
    text: "Zod at edges, inferred types, Result/unknown instead of any, branded IDs, satisfies for config objects. Interviewers love boundary validation.",
  },
  {
    id: "k-english-interview",
    kind: "knowledge",
    title: "English phrases for technical interviews",
    text: "Restate the problem. Trade-off X vs Y. I would pick X because. Failure mode I worry about. Similar constraint in Skedpal/Javi/NextTarget. I have not used that library but the idea is similar to.",
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
