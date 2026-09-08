import type { StudyDestination, StudyHeadline } from "@/types/learning";

export const LEARNER_PROFILE = [
  "Alireza Bagheri — 8+ years shipping production apps (React, Next.js, TypeScript, NestJS, Prisma, Postgres).",
  "M.Sc. AI. Goal: senior software engineer interviews (frontend + backend + AI).",
  "Rusty on interview fundamentals; strong on shipping. Persian native, interviews in English.",
  "Real systems: Skedpal (frontend lead), NextTarget, Javi English, AzarTime.",
].join(" ");

export const STUDY_DESTINATIONS: StudyDestination[] = [
  {
    id: "js-ts",
    order: 1,
    title: "JavaScript & TypeScript",
    subtitle: "Language internals interviewers actually probe",
    goal: "Predict runtime behavior and type the API boundary without guessing.",
    interviewSignal: "Walk through closures, this, the event loop, and a generic client without notes.",
    ragKeywords: ["closures", "event loop", "promises", "this", "prototypes", "typescript", "generics", "unknown"],
    seedHeadlines: [
      { id: "js-ts-closures", title: "Closures, lexical scope, and what the GC keeps", why: "Private state, once(), and stale React closures all come from this.", depth: "core" },
      { id: "js-ts-this", title: "this, prototypes, and call/bind/apply", why: "Classic trick questions; you need a mechanical model.", depth: "core" },
      { id: "js-ts-event-loop", title: "Event loop: stack, microtasks, macrotasks, render", why: "Senior frontend screen almost always includes this.", depth: "interview" },
      { id: "js-ts-promises", title: "Promise internals, all/race/allSettled, async/await", why: "You will be asked to implement or predict output.", depth: "core" },
      { id: "js-ts-ts-narrowing", title: "unknown, never, narrowing, and Zod at the edge", why: "Interviewers want typed boundaries, not any.", depth: "core" },
      { id: "js-ts-generics", title: "Generics, conditional types, and a typed API client", why: "Shows you can design types, not just consume them.", depth: "interview" },
      { id: "js-ts-from-scratch", title: "Implement EventEmitter, debounce, throttle, Promise.all", why: "Live-coding flavor of the same fundamentals.", depth: "lab" },
    ],
    resources: [
      { title: "javascript.info — The JavaScript language", url: "https://javascript.info/", type: "docs" },
      { title: "Jake Archibald — In The Loop", url: "https://www.youtube.com/watch?v=cCOL7MC4Pl0", type: "video" },
      { title: "Total TypeScript — free tutorials", url: "https://www.totaltypescript.com/tutorials", type: "course" },
    ],
  },
  {
    id: "browser",
    order: 2,
    title: "Browser, HTTP & Security",
    subtitle: "From URL bar to first paint, then keep it fast and safe",
    goal: "Explain loading, caching, cookies, and the OWASP issues your apps actually face.",
    interviewSignal: "Narrate what happens after Enter, then how Javi/NextTarget handle XSS and auth cookies.",
    ragKeywords: ["rendering", "HTTP", "cache", "CORS", "cookies", "XSS", "CSRF", "CSP", "LCP", "Core Web Vitals"],
    seedHeadlines: [
      { id: "browser-url", title: "What happens after you type a URL", why: "The canonical senior frontend opener.", depth: "interview" },
      { id: "browser-crp", title: "Critical rendering path, CSSOM, and JS blocking", why: "Connects browser internals to LCP.", depth: "core" },
      { id: "browser-http-cache", title: "Cache-Control, ETag, CDN, HTTP/2/3", why: "You have run real sites; make the model precise.", depth: "core" },
      { id: "browser-cors", title: "CORS, cookies, SameSite, and credentialed APIs", why: "SPA + NestJS is your daily architecture.", depth: "interview" },
      { id: "browser-xss", title: "XSS, CSRF, CSP — mapped onto your products", why: "Security answers must be concrete, not lists.", depth: "interview" },
      { id: "browser-cwv", title: "Core Web Vitals and how you actually profile", why: "Skedpal migration story needs this vocabulary.", depth: "lab" },
    ],
    resources: [
      { title: "web.dev — Learn Performance", url: "https://web.dev/learn/performance", type: "course" },
      { title: "MDN — HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP", type: "docs" },
      { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", type: "article" },
    ],
  },
  {
    id: "react",
    order: 3,
    title: "React Internals",
    subtitle: "Fiber, data fetching, and architecture trade-offs",
    goal: "Explain renders, effects, and RSC vs client as decisions, not slogans.",
    interviewSignal: "Debug a slow list, then defend RSC vs CSR with a Skedpal or portfolio example.",
    ragKeywords: ["Fiber", "reconciliation", "memo", "useEffect", "RSC", "Server Components", "Zustand", "React Query"],
    seedHeadlines: [
      { id: "react-fiber", title: "Render vs commit, Fiber, and what a key actually does", why: "Stops you from hand-waving reconciliation.", depth: "core" },
      { id: "react-memo", title: "When memo, useMemo, and useCallback help vs hurt", why: "Seniors get this wrong in both directions.", depth: "interview" },
      { id: "react-effects", title: "useEffect pitfalls and data-fetching models", why: "Most production bugs you have seen live here.", depth: "core" },
      { id: "react-rsc", title: "RSC vs CSR vs SSR/ISR decision matrix", why: "Next.js interviews will go here immediately.", depth: "interview" },
      { id: "react-state", title: "Redux vs Zustand vs React Query — what belongs where", why: "Architecture, not library trivia.", depth: "core" },
      { id: "react-perf-lab", title: "Profile a slow list and add virtualization", why: "You need one lab you can narrate.", depth: "lab" },
    ],
    resources: [
      { title: "react.dev — Escape Hatches", url: "https://react.dev/learn/escape-hatches", type: "docs" },
      { title: "A Complete Guide to useEffect", url: "https://overreacted.io/a-complete-guide-to-useeffect/", type: "article" },
      { title: "React Fiber architecture notes", url: "https://github.com/acdlite/react-fiber-architecture", type: "article" },
    ],
  },
  {
    id: "node-api",
    order: 4,
    title: "Node, NestJS & APIs",
    subtitle: "Backend decisions you can defend on a whiteboard",
    goal: "Design auth, validation, and error contracts the way NextTarget already does.",
    interviewSignal: "JWT vs sessions, NestJS guards, idempotency, and a booking API outline.",
    ragKeywords: ["Node event loop", "streams", "NestJS", "JWT", "OAuth", "RBAC", "idempotency", "REST"],
    seedHeadlines: [
      { id: "node-loop", title: "Node event loop phases vs the browser loop", why: "People mix these; you should not.", depth: "core" },
      { id: "node-rest", title: "REST contracts: pagination, errors, versioning", why: "Senior backend is API taste.", depth: "core" },
      { id: "node-auth", title: "AuthN vs AuthZ: JWT, sessions, OAuth2, RBAC", why: "NextTarget has four roles — use that.", depth: "interview" },
      { id: "node-nest", title: "NestJS modules, DI, guards, interceptors", why: "Your production backend style.", depth: "core" },
      { id: "node-idempotency", title: "Idempotent webhooks and Zarinpal-style retries", why: "Payments interviews are won here.", depth: "interview" },
      { id: "node-testing", title: "API testing: e2e vs unit vs contract", why: "Seniors prevent regressions.", depth: "lab" },
    ],
    resources: [
      { title: "Node.js — Event loop", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick", type: "docs" },
      { title: "NestJS docs", url: "https://docs.nestjs.com/", type: "docs" },
      { title: "Hussein Nasser — backend engineering", url: "https://www.youtube.com/@hnasr", type: "video" },
    ],
  },
  {
    id: "data",
    order: 5,
    title: "PostgreSQL, Redis & Jobs",
    subtitle: "Indexes, isolation, cache, and queues",
    goal: "Debug a slow query and pick a Redis pattern without folklore.",
    interviewSignal: "EXPLAIN ANALYZE, isolation anomalies, cache-aside, BullMQ idempotency.",
    ragKeywords: ["B-tree", "EXPLAIN ANALYZE", "MVCC", "isolation", "Prisma", "Redis", "BullMQ", "N+1"],
    seedHeadlines: [
      { id: "data-indexes", title: "B-tree indexes and reading EXPLAIN ANALYZE", why: "The only honest answer to 'the query is slow'.", depth: "core" },
      { id: "data-tx", title: "Transactions, isolation levels, and real anomalies", why: "Dirty read / phantom with examples, not definitions.", depth: "interview" },
      { id: "data-prisma", title: "N+1, pooling, and Prisma in production", why: "Your actual ORM; know its failure modes.", depth: "core" },
      { id: "data-redis", title: "Redis: cache-aside, TTL, rate limit, lock", why: "Patterns you can sketch in two minutes.", depth: "interview" },
      { id: "data-queues", title: "BullMQ jobs, retries, and poison messages", why: "NextTarget and AzarTime both depend on this.", depth: "lab" },
    ],
    resources: [
      { title: "Use The Index, Luke", url: "https://use-the-index-luke.com/", type: "article" },
      { title: "PostgreSQL — Indexes", url: "https://www.postgresql.org/docs/current/indexes.html", type: "docs" },
    ],
  },
  {
    id: "systems",
    order: 6,
    title: "System Design",
    subtitle: "Building blocks, then your own products",
    goal: "Run a 45-minute design: clarify, estimate, sketch, deep-dive, trade-offs.",
    interviewSignal: "URL shortener, rate limiter, notifications, then NextTarget or Javi.",
    ragKeywords: ["load balancing", "sharding", "CAP", "queues", "rate limiter", "URL shortener", "capacity"],
    seedHeadlines: [
      { id: "systems-blocks", title: "Load balancing, sharding, replication, CAP", why: "Shared vocabulary before any design.", depth: "core" },
      { id: "systems-estimate", title: "Capacity estimation without theater", why: "Back-of-envelope that is internally consistent.", depth: "interview" },
      { id: "systems-shortener", title: "Design a URL shortener end to end", why: "Classic; you must be fluent.", depth: "interview" },
      { id: "systems-ratelimit", title: "Design a rate limiter (token bucket vs window)", why: "Maps to Redis work you already ship.", depth: "interview" },
      { id: "systems-notify", title: "Design notifications (email/SMS/push)", why: "Queues, retries, preferences.", depth: "interview" },
      { id: "systems-products", title: "C4 for NextTarget and Javi in 10 minutes", why: "Your unfair advantage — practice presenting it.", depth: "lab" },
    ],
    resources: [
      { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "article" },
      { title: "ByteByteGo", url: "https://www.youtube.com/@ByteByteGo", type: "video" },
    ],
  },
  {
    id: "llm",
    order: 7,
    title: "LLM Foundations",
    subtitle: "How the API actually behaves in production",
    goal: "Talk tokens, structured output, cost, and injection like an engineer, not a demo.",
    interviewSignal: "How would you add AI to an existing SaaS — with numbers.",
    ragKeywords: ["tokens", "prompting", "function calling", "structured outputs", "prompt injection", "streaming"],
    seedHeadlines: [
      { id: "llm-how", title: "How LLMs work at a practical level", why: "Enough transformer intuition to not freeze.", depth: "core" },
      { id: "llm-prompt", title: "System prompts, few-shot, and structured outputs", why: "This is how Javi scoring should be explained.", depth: "core" },
      { id: "llm-tools", title: "Function calling vs JSON mode", why: "Interviewers mix these; separate them cleanly.", depth: "interview" },
      { id: "llm-cost", title: "Streaming, retries, caches, and token budgets", why: "Production AI is cost and latency.", depth: "lab" },
      { id: "llm-safety", title: "Prompt injection and PII in multi-tenant apps", why: "Javi is multi-sided; this is a real risk.", depth: "interview" },
    ],
    resources: [
      { title: "Karpathy — Intro to LLMs", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", type: "video" },
      { title: "OpenAI — Function calling", url: "https://platform.openai.com/docs/guides/function-calling", type: "docs" },
      { title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/", type: "article" },
    ],
  },
  {
    id: "rag-dest",
    order: 8,
    title: "Embeddings & RAG",
    subtitle: "Retrieval you can evaluate, not a vector-DB slogan",
    goal: "Design hybrid search, chunking, and a doc-Q&A bot with failure modes.",
    interviewSignal: "When RAG vs long context vs fine-tune; how you know retrieval is bad.",
    ragKeywords: ["embeddings", "chunking", "pgvector", "hybrid search", "rerank", "RAG eval"],
    seedHeadlines: [
      { id: "rag-embed", title: "Embeddings, cosine, and what similarity is not", why: "Stops magical thinking about vectors.", depth: "core" },
      { id: "rag-chunk", title: "Chunking and metadata that actually retrieve", why: "Quality lives here more than in the model.", depth: "core" },
      { id: "rag-hybrid", title: "Lexical + vector hybrid search (this studio)", why: "You can point at this codebase in an interview.", depth: "interview" },
      { id: "rag-eval", title: "Evaluating retrieval: gold questions and misses", why: "Seniors measure; juniors prompt.", depth: "lab" },
      { id: "rag-vs", title: "RAG vs fine-tune vs long context", why: "Decision framework, not a hot take.", depth: "interview" },
    ],
    resources: [
      { title: "pgvector", url: "https://github.com/pgvector/pgvector", type: "docs" },
      { title: "Anthropic — Contextual retrieval", url: "https://www.anthropic.com/news/contextual-retrieval", type: "article" },
      { title: "OpenAI Cookbook", url: "https://cookbook.openai.com/", type: "practice" },
    ],
  },
  {
    id: "agents",
    order: 9,
    title: "Agents, Evals & Shipping",
    subtitle: "Tool loops you would actually put in production",
    goal: "Describe an agent, an eval set, and one shipped AI change with a metric.",
    interviewSignal: "Design IELTS grading for Javi: tools, evals, tracing, human fallback.",
    ragKeywords: ["agents", "tool calling", "evals", "tracing", "human in the loop", "observability"],
    seedHeadlines: [
      { id: "agents-loop", title: "Agent loops and tool calling without the hype", why: "A loop, a budget, and stop conditions.", depth: "core" },
      { id: "agents-eval", title: "Golden sets and LLM-as-judge — when each lies", why: "You cannot ship without evals.", depth: "interview" },
      { id: "agents-obs", title: "Tracing, token caps, and alerts that matter", why: "Observability for AI features.", depth: "core" },
      { id: "agents-hitl", title: "Human-in-the-loop for scoring and coaching", why: "Javi and NextTarget both need this.", depth: "interview" },
      { id: "agents-ship", title: "Ship one measurable AI improvement", why: "Resume bullet + STAR in one lab.", depth: "lab" },
    ],
    resources: [
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article" },
      { title: "Chip Huyen — AI Engineering", url: "https://huyenchip.com/blog/", type: "article" },
    ],
  },
  {
    id: "dsa",
    order: 10,
    title: "DSA Patterns",
    subtitle: "Pattern fluency, not a 12-week calendar",
    goal: "Recognize the pattern in 2 minutes and implement under a 75-minute clock.",
    interviewSignal: "Timed sets: arrays, windows, trees, graphs, DP.",
    ragKeywords: ["arrays", "hashing", "two pointers", "sliding window", "trees", "graphs", "dynamic programming", "NeetCode"],
    seedHeadlines: [
      { id: "dsa-hash", title: "Arrays & hashing (Two Sum through Longest Consecutive)", why: "Warm-up that still fails people on edge cases.", depth: "core" },
      { id: "dsa-window", title: "Two pointers and sliding window", why: "Most medium strings/arrays.", depth: "core" },
      { id: "dsa-stack", title: "Stacks, monotonic stacks, and parse problems", why: "Small pattern, high interview density.", depth: "core" },
      { id: "dsa-trees", title: "Linked lists and trees (LCA, BST, level order)", why: "Recursive thinking they expect out loud.", depth: "interview" },
      { id: "dsa-heap", title: "Heaps and backtracking", why: "Kth, subsets, word search.", depth: "core" },
      { id: "dsa-graphs", title: "Graphs: BFS/DFS, topo, grids", why: "Islands, courses, rotting oranges.", depth: "interview" },
      { id: "dsa-dp", title: "1D and 2D DP you can actually derive", why: "Don't memorize table shapes — derive the recurrence.", depth: "interview" },
      { id: "dsa-timed", title: "Timed sets: 2 mediums in 50 minutes", why: "The skill is pacing, not solutions.", depth: "lab" },
    ],
    resources: [
      { title: "NeetCode 150", url: "https://neetcode.io/practice", type: "practice" },
    ],
  },
  {
    id: "interview",
    order: 11,
    title: "Interview English & STAR",
    subtitle: "Say it out loud, then tighten it",
    goal: "Eight STAR stories under two minutes and a 90-second technical recap in English.",
    interviewSignal: "Leadership, conflict, failure, AI shipping — with numbers.",
    ragKeywords: ["STAR", "English", "Skedpal", "NextTarget", "Javi", "behavioral", "resume"],
    seedHeadlines: [
      { id: "int-star-skedpal", title: "STAR: Skedpal WordPress → Next.js", why: "Leadership + 30% faster is your cleanest metric.", depth: "interview" },
      { id: "int-star-jquery", title: "STAR: jQuery → React bundle cut", why: "Incremental delivery, 40% smaller JS.", depth: "interview" },
      { id: "int-star-nexttarget", title: "STAR: shipping NextTarget solo", why: "Ownership and scoping risk.", depth: "interview" },
      { id: "int-star-javi", title: "STAR: Javi AI scoring in production", why: "AI engineering that is not a toy.", depth: "interview" },
      { id: "int-star-azar", title: "STAR: AzarTime commerce ops", why: "Jobs, payments, feeds.", depth: "interview" },
      { id: "int-english", title: "90-second English recaps of hard topics", why: "Fluency under pressure is a separate skill.", depth: "lab" },
      { id: "int-resume", title: "Resume bullets with numbers", why: "Every line must earn a follow-up question you want.", depth: "lab" },
    ],
    resources: [
      { title: "STAR method", url: "https://www.themuse.com/advice/star-interview-method", type: "article" },
      { title: "Amazon Leadership Principles", url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles", type: "article" },
    ],
  },
];

export function getDestination(id: string): StudyDestination | undefined {
  return STUDY_DESTINATIONS.find((d) => d.id === id);
}

export function getSeedHeadline(destinationId: string, headlineId: string): StudyHeadline | undefined {
  return getDestination(destinationId)?.seedHeadlines.find((h) => h.id === headlineId);
}

export function slugifyHeadline(destinationId: string, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${destinationId}-${slug || "topic"}`;
}

export function mergeHeadlines(seed: StudyHeadline[], generated: StudyHeadline[]): StudyHeadline[] {
  const seen = new Set<string>();
  const out: StudyHeadline[] = [];
  for (const h of [...seed, ...generated]) {
    const id = h.id || slugifyHeadline("x", h.title);
    if (seen.has(id) || seen.has(h.title.toLowerCase())) continue;
    seen.add(id);
    seen.add(h.title.toLowerCase());
    out.push({ ...h, id });
  }
  return out;
}
