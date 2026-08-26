import type { LearningPhase } from "@/types/learning";

/**
 * Adjustable 12-week (3-month) senior software engineer path.
 * ~5h/day, 6 days/week. Covers frontend depth, backend, system design, and AI engineering.
 * DSA runs as a daily 1.5h thread through all 12 weeks.
 * Edit this file anytime — progress is keyed by stable task IDs.
 */
export const LEARNING_CURRICULUM: LearningPhase[] = [
  {
    id: "phase-1",
    number: 1,
    title: "Foundations: JS/TS, Platform & React Internals",
    description:
      "Rebuild fundamentals from first principles — the things interviews probe that product work doesn't exercise. DSA thread starts: 1.5h daily.",
    weekRange: [1, 3],
    weeks: [
      {
        id: "sw01",
        weekNumber: 1,
        title: "JavaScript & TypeScript Core",
        focus: "Closures, prototypes, this, event loop, promises, TS type-system depth",
        dailySplit: "1.5h DSA (arrays & hashing) · 2h JS/TS theory · 1h code drills · 0.5h flashcards",
        topics: [
          "Execution context & closures",
          "Prototypes & this binding",
          "Event loop, microtasks vs macrotasks",
          "Promise internals, async/await",
          "TS generics, narrowing, conditional types",
        ],
        resources: [
          {
            title: "javascript.info — The JavaScript language",
            url: "https://javascript.info/",
            type: "docs",
          },
          {
            title: "Jake Archibald — In The Loop (JSConf)",
            url: "https://www.youtube.com/watch?v=cCOL7MC4Pl0",
            type: "video",
          },
          {
            title: "Total TypeScript — free tutorials",
            url: "https://www.totaltypescript.com/tutorials",
            type: "course",
          },
          {
            title: "NeetCode 150 — Arrays & Hashing",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
        ],
        tasks: [
          { id: "sw01-t1", title: "DSA: solve Arrays & Hashing set (Two Sum, Group Anagrams, Top K, Product Except Self, Longest Consecutive)", estimatedMinutes: 450 },
          { id: "sw01-t2", title: "Predict output of 20 closure/this/event-loop snippets, then verify", estimatedMinutes: 150 },
          { id: "sw01-t3", title: "Implement from scratch: EventEmitter, Promise.all, debounce/throttle", estimatedMinutes: 180 },
          { id: "sw01-t4", title: "TS drills: solve 15 type-challenges (easy) + type a generic API client", estimatedMinutes: 180 },
          { id: "sw01-t5", title: "Write one-page notes: event loop diagram + prototype chain", estimatedMinutes: 60 },
          { id: "sw01-t6", title: "Record yourself explaining closures and the event loop in English (2 min each)", estimatedMinutes: 45 },
        ],
      },
      {
        id: "sw02",
        weekNumber: 2,
        title: "Browser, HTTP, Security & Performance",
        focus: "Rendering pipeline, caching, CORS, XSS/CSRF, Core Web Vitals",
        dailySplit: "1.5h DSA (two pointers, sliding window, stack) · 2h theory · 1.5h labs",
        topics: [
          "Critical rendering path",
          "HTTP/2/3, caching, CDN, ETag",
          "CORS, cookies, SameSite",
          "XSS, CSRF, CSP, OWASP Top 10",
          "Core Web Vitals & profiling",
        ],
        resources: [
          {
            title: "web.dev — Learn Performance",
            url: "https://web.dev/learn/performance",
            type: "course",
          },
          {
            title: "MDN — HTTP guide & CORS",
            url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
            type: "docs",
          },
          {
            title: "OWASP Top 10",
            url: "https://owasp.org/www-project-top-ten/",
            type: "article",
          },
        ],
        tasks: [
          { id: "sw02-t1", title: "DSA: Two Pointers + Sliding Window set (3Sum, Container With Most Water, Longest Substring, Min Window)", estimatedMinutes: 450 },
          { id: "sw02-t2", title: "Lighthouse audit on your portfolio + one client project; fix top 3 issues", estimatedMinutes: 180 },
          { id: "sw02-t3", title: "Cheatsheet: Cache-Control directives, ETag flow, CDN strategy", estimatedMinutes: 90 },
          { id: "sw02-t4", title: "Explain CORS preflight + cookie security with a NestJS/Next.js example", estimatedMinutes: 90 },
          { id: "sw02-t5", title: "Security notes: how Javi/NextTarget handle XSS, CSRF, auth tokens", estimatedMinutes: 120 },
          { id: "sw02-t6", title: "Mock Q: 'Walk me through what happens when you type a URL' (record it)", estimatedMinutes: 45 },
        ],
      },
      {
        id: "sw03",
        weekNumber: 3,
        title: "React Internals & Frontend Architecture",
        focus: "Fiber, reconciliation, RSC, state management trade-offs, performance",
        dailySplit: "1.5h DSA (linked lists, trees) · 2h React internals · 1.5h profiling labs",
        topics: [
          "Render vs commit phase, Fiber",
          "Keys, reconciliation, memoization",
          "useEffect pitfalls & data fetching",
          "Server Components vs Client Components",
          "Redux vs Zustand vs React Query trade-offs",
        ],
        resources: [
          {
            title: "react.dev — Escape Hatches",
            url: "https://react.dev/learn/escape-hatches",
            type: "docs",
          },
          {
            title: "A Complete Guide to useEffect — Dan Abramov",
            url: "https://overreacted.io/a-complete-guide-to-useeffect/",
            type: "article",
          },
          {
            title: "React Fiber architecture notes",
            url: "https://github.com/acdlite/react-fiber-architecture",
            type: "article",
          },
          {
            title: "NeetCode — Trees playlist",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
        ],
        tasks: [
          { id: "sw03-t1", title: "DSA: Linked List + Trees set (Reverse List, LRU Cache, Invert Tree, Level Order, Validate BST, LCA)", estimatedMinutes: 450 },
          { id: "sw03-t2", title: "Notes: what triggers a re-render; when memo/useMemo/useCallback help vs hurt", estimatedMinutes: 120 },
          { id: "sw03-t3", title: "Lab: profile a slow list with React DevTools, fix re-renders, add virtualization", estimatedMinutes: 180 },
          { id: "sw03-t4", title: "Write RSC vs CSR vs SSR/ISR decision matrix with examples from your apps", estimatedMinutes: 90 },
          { id: "sw03-t5", title: "Answer 20 React interview questions out loud (record 5)", estimatedMinutes: 120 },
          { id: "sw03-t6", title: "Design exercise: autocomplete search component (a11y, debounce, cache, i18n)", estimatedMinutes: 90 },
        ],
      },
    ],
  },
  {
    id: "phase-2",
    number: 2,
    title: "Backend Engineering & Databases",
    description:
      "Node internals, API design, auth, Postgres depth, Redis, and queues — turn your NestJS experience into explainable engineering decisions.",
    weekRange: [4, 6],
    weeks: [
      {
        id: "sw04",
        weekNumber: 4,
        title: "Node.js, NestJS & API Design",
        focus: "Node internals, REST design, auth (JWT/sessions/OAuth), validation, testing",
        dailySplit: "1.5h DSA (heaps, backtracking) · 2h backend theory · 1.5h build/refactor",
        topics: [
          "Node event loop, streams, worker threads",
          "REST API design & versioning",
          "AuthN vs AuthZ: JWT, sessions, OAuth2, RBAC",
          "NestJS modules, DI, guards, interceptors",
          "Error handling & API testing",
        ],
        resources: [
          {
            title: "Node.js docs — Event loop, timers, process.nextTick",
            url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
            type: "docs",
          },
          {
            title: "NestJS docs — fundamentals & security",
            url: "https://docs.nestjs.com/",
            type: "docs",
          },
          {
            title: "Hussein Nasser — backend engineering (YouTube)",
            url: "https://www.youtube.com/@hnasr",
            type: "video",
          },
        ],
        tasks: [
          { id: "sw04-t1", title: "DSA: Heaps + Backtracking set (Kth Largest, Task Scheduler, Subsets, Combination Sum, Word Search)", estimatedMinutes: 450 },
          { id: "sw04-t2", title: "Notes: Node event loop phases vs browser; when to use streams/workers", estimatedMinutes: 120 },
          { id: "sw04-t3", title: "Design an auth flow doc: JWT vs session trade-offs, refresh rotation, RBAC from NextTarget", estimatedMinutes: 150 },
          { id: "sw04-t4", title: "Build: small NestJS API (CRUD + auth + validation + e2e tests) as a reference repo", estimatedMinutes: 240 },
          { id: "sw04-t5", title: "Write API design checklist: pagination, idempotency, error contracts, versioning", estimatedMinutes: 90 },
          { id: "sw04-t6", title: "Mock Q: 'Design the API for a booking system' — outline in 20 min", estimatedMinutes: 60 },
        ],
      },
      {
        id: "sw05",
        weekNumber: 5,
        title: "PostgreSQL, Redis & Data Modeling",
        focus: "Indexes, query plans, transactions, caching strategies, queues",
        dailySplit: "1.5h DSA (graphs) · 2h database theory · 1.5h hands-on SQL/Prisma",
        topics: [
          "B-tree indexes & EXPLAIN ANALYZE",
          "Transactions, isolation levels, locks",
          "N+1, connection pooling, Prisma optimization",
          "Redis: caching patterns, rate limiting, pub/sub",
          "BullMQ / job queues & idempotency",
        ],
        resources: [
          {
            title: "Use The Index, Luke",
            url: "https://use-the-index-luke.com/",
            type: "article",
          },
          {
            title: "PostgreSQL docs — Indexes & MVCC",
            url: "https://www.postgresql.org/docs/current/indexes.html",
            type: "docs",
          },
          {
            title: "NeetCode — Graphs playlist",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
        ],
        tasks: [
          { id: "sw05-t1", title: "DSA: Graphs set (Number of Islands, Clone Graph, Course Schedule I/II, Rotting Oranges, Word Ladder)", estimatedMinutes: 450 },
          { id: "sw05-t2", title: "Run EXPLAIN ANALYZE on 5 real queries from a project; add/fix indexes", estimatedMinutes: 150 },
          { id: "sw05-t3", title: "Notes: isolation levels with concrete anomaly examples (dirty read, phantom)", estimatedMinutes: 90 },
          { id: "sw05-t4", title: "Design an idempotent payment webhook table (unique keys, retries) from Zarinpal experience", estimatedMinutes: 90 },
          { id: "sw05-t5", title: "Cheatsheet: Redis patterns — cache-aside, TTL, rate limiter, distributed lock", estimatedMinutes: 90 },
          { id: "sw05-t6", title: "Mock Q: 'This query is slow in production — walk me through debugging it'", estimatedMinutes: 60 },
        ],
      },
      {
        id: "sw06",
        weekNumber: 6,
        title: "System Design Fundamentals",
        focus: "Scalability building blocks + classic interview designs",
        dailySplit: "1.5h DSA (1-D DP) · 2h system design theory · 1.5h design practice",
        topics: [
          "Load balancing, horizontal scaling, sharding",
          "CAP, consistency models, replication",
          "Message queues & event-driven architecture",
          "Capacity estimation",
          "Classic designs: URL shortener, rate limiter, notifications",
        ],
        resources: [
          {
            title: "ByteByteGo — System Design (YouTube)",
            url: "https://www.youtube.com/@ByteByteGo",
            type: "video",
          },
          {
            title: "System Design Primer (GitHub)",
            url: "https://github.com/donnemartin/system-design-primer",
            type: "article",
          },
          {
            title: "NeetCode — System Design playlist",
            url: "https://www.youtube.com/@NeetCodeIO",
            type: "video",
          },
        ],
        tasks: [
          { id: "sw06-t1", title: "DSA: 1-D DP set (Climbing Stairs, House Robber I/II, Coin Change, Word Break, LIS)", estimatedMinutes: 450 },
          { id: "sw06-t2", title: "Design URL shortener end-to-end with capacity math (write it up)", estimatedMinutes: 120 },
          { id: "sw06-t3", title: "Design a rate limiter (token bucket vs sliding window, Redis impl)", estimatedMinutes: 90 },
          { id: "sw06-t4", title: "Design a notification system (email/SMS/push, queues, retries, preferences)", estimatedMinutes: 120 },
          { id: "sw06-t5", title: "Draw C4 diagrams for NextTarget and Javi — practice presenting them in 10 min", estimatedMinutes: 150 },
          { id: "sw06-t6", title: "Full 45-min mock system design interview (record + postmortem)", estimatedMinutes: 90 },
        ],
      },
    ],
  },
  {
    id: "phase-3",
    number: 3,
    title: "AI Engineering",
    description:
      "LLM APIs, embeddings, RAG, agents, and evals — combine your M.Sc. AI background with production engineering. Ship a real AI feature.",
    weekRange: [7, 9],
    weeks: [
      {
        id: "sw07",
        weekNumber: 7,
        title: "LLM Foundations & Prompt Engineering",
        focus: "How LLMs work, prompting, structured outputs, cost/latency control",
        dailySplit: "1.5h DSA (2-D DP, intervals) · 2h AI theory · 1.5h API practice",
        topics: [
          "Transformers & tokens (practical level)",
          "Prompting: few-shot, chain-of-thought, system prompts",
          "Structured outputs & function calling",
          "Streaming, caching, cost & rate-limit management",
          "Safety: prompt injection, PII",
        ],
        resources: [
          {
            title: "Andrej Karpathy — Intro to LLMs",
            url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
            type: "video",
          },
          {
            title: "OpenAI docs — Structured outputs & function calling",
            url: "https://platform.openai.com/docs/guides/function-calling",
            type: "docs",
          },
          {
            title: "Prompt Engineering Guide",
            url: "https://www.promptingguide.ai/",
            type: "article",
          },
        ],
        tasks: [
          { id: "sw07-t1", title: "DSA: 2-D DP + Intervals set (Unique Paths, LCS, Edit Distance, Non-overlapping Intervals)", estimatedMinutes: 450 },
          { id: "sw07-t2", title: "Watch Karpathy LLM intro; write 1-page 'how LLMs work' explainer", estimatedMinutes: 150 },
          { id: "sw07-t3", title: "Build: CLI/script with streaming, retries, JSON-schema structured output", estimatedMinutes: 180 },
          { id: "sw07-t4", title: "Refactor one OpenAI prompt from Javi/NextTarget: measure quality + token cost before/after", estimatedMinutes: 150 },
          { id: "sw07-t5", title: "Notes: prompt injection attacks + mitigations for your products", estimatedMinutes: 60 },
          { id: "sw07-t6", title: "Mock Q: 'How would you add AI to an existing SaaS?' (10-min answer)", estimatedMinutes: 45 },
        ],
      },
      {
        id: "sw08",
        weekNumber: 8,
        title: "Embeddings, RAG & Vector Search",
        focus: "Embeddings, chunking, pgvector, retrieval quality, hybrid search",
        dailySplit: "1.5h DSA (mixed review) · 2h RAG theory · 1.5h build RAG pipeline",
        topics: [
          "Embeddings & similarity metrics",
          "Chunking strategies & metadata",
          "pgvector / vector DBs",
          "RAG architecture & reranking",
          "Evaluating retrieval quality",
        ],
        resources: [
          {
            title: "pgvector — Postgres vector search",
            url: "https://github.com/pgvector/pgvector",
            type: "docs",
          },
          {
            title: "What is RAG — Anthropic overview",
            url: "https://www.anthropic.com/news/contextual-retrieval",
            type: "article",
          },
          {
            title: "OpenAI Cookbook — embeddings & RAG examples",
            url: "https://cookbook.openai.com/",
            type: "practice",
          },
        ],
        tasks: [
          { id: "sw08-t1", title: "DSA: re-solve your 15 hardest misses from weeks 1–7 under time pressure", estimatedMinutes: 450 },
          { id: "sw08-t2", title: "Build: RAG over your own study notes (embed, store in pgvector, retrieve, answer)", estimatedMinutes: 300 },
          { id: "sw08-t3", title: "Experiment: 3 chunking strategies; compare answer quality on 10 questions", estimatedMinutes: 120 },
          { id: "sw08-t4", title: "Notes: when RAG vs fine-tuning vs long context", estimatedMinutes: 60 },
          { id: "sw08-t5", title: "Design doc: add AI search to AzarTime product catalog (RAG + filters)", estimatedMinutes: 120 },
          { id: "sw08-t6", title: "Mock Q: 'Design a documentation Q&A bot' — 30-min system design", estimatedMinutes: 60 },
        ],
      },
      {
        id: "sw09",
        weekNumber: 9,
        title: "Agents, Evals & Shipping an AI Feature",
        focus: "Tool-calling agents, evaluation, observability — ship something real",
        dailySplit: "1.5h DSA (timed sets) · 1h theory · 2.5h build & ship",
        topics: [
          "Agent loops & tool calling",
          "Evals: golden sets, LLM-as-judge",
          "AI observability: tracing, token budgets",
          "Human-in-the-loop patterns",
          "AI system design interviews",
        ],
        resources: [
          {
            title: "Anthropic — Building effective agents",
            url: "https://www.anthropic.com/research/building-effective-agents",
            type: "article",
          },
          {
            title: "OpenAI Cookbook — agents & evals",
            url: "https://cookbook.openai.com/",
            type: "practice",
          },
          {
            title: "Chip Huyen — AI Engineering notes",
            url: "https://huyenchip.com/blog/",
            type: "article",
          },
        ],
        tasks: [
          { id: "sw09-t1", title: "DSA: 3 timed sets — 3 mediums in 75 min each (simulate real interviews)", estimatedMinutes: 300 },
          { id: "sw09-t2", title: "Build: small agent with 2–3 tools (e.g. study coach that reads your progress + suggests plan)", estimatedMinutes: 300 },
          { id: "sw09-t3", title: "Create a 20-case eval set for one AI feature; score before/after a prompt change", estimatedMinutes: 150 },
          { id: "sw09-t4", title: "Ship: one AI improvement to Javi or NextTarget (measurable)", estimatedMinutes: 240 },
          { id: "sw09-t5", title: "Write resume bullet + STAR story for the shipped AI feature", estimatedMinutes: 60 },
          { id: "sw09-t6", title: "Mock: 'Design an AI-powered IELTS grading system' — you built one; present it", estimatedMinutes: 60 },
        ],
      },
    ],
  },
  {
    id: "phase-4",
    number: 4,
    title: "Interview Sprint & Applications",
    description:
      "Convert 9 weeks of depth into offers: mixed mocks, STAR stories, English drills, and a focused application campaign.",
    weekRange: [10, 12],
    weeks: [
      {
        id: "sw10",
        weekNumber: 10,
        title: "Mock Interview Gauntlet",
        focus: "Alternate coding / system design / React-Node deep-dives daily",
        dailySplit: "1.5h DSA timed · 1.5h mock or drill · 1h postmortem · 1h weak-spot repair",
        topics: [
          "Think-aloud coding under pressure",
          "System design communication structure",
          "JS/React/Node rapid-fire questions",
          "Postmortem discipline",
        ],
        resources: [
          {
            title: "Pramp — free mock interviews",
            url: "https://www.pramp.com/",
            type: "practice",
          },
          {
            title: "GreatFrontEnd — question bank",
            url: "https://www.greatfrontend.com/",
            type: "practice",
          },
          {
            title: "NeetCode Blind 75 review",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
        ],
        tasks: [
          { id: "sw10-t1", title: "3 mock coding interviews (Pramp/peer) with written postmortems", estimatedMinutes: 300 },
          { id: "sw10-t2", title: "2 mock system design interviews (one classic, one AI system)", estimatedMinutes: 180 },
          { id: "sw10-t3", title: "Rapid-fire: 40 JS/React/Node questions answered out loud", estimatedMinutes: 180 },
          { id: "sw10-t4", title: "DSA: daily timed set — 2 mediums in 50 min, 6 days", estimatedMinutes: 300 },
          { id: "sw10-t5", title: "Repair plan: pick top 3 weaknesses from postmortems, drill each 2h", estimatedMinutes: 360 },
          { id: "sw10-t6", title: "English drill: explain one system per day in 3 minutes, recorded", estimatedMinutes: 90 },
        ],
      },
      {
        id: "sw11",
        weekNumber: 11,
        title: "Behavioral Stories & Materials",
        focus: "STAR stories, resume with metrics, LinkedIn, portfolio polish",
        dailySplit: "1.5h DSA maintenance · 2h stories/materials · 1.5h applications prep",
        topics: [
          "STAR: leadership, conflict, failure, ambiguity",
          "Quantified resume bullets",
          "LinkedIn & GitHub presentation",
          "Target company list",
        ],
        resources: [
          {
            title: "STAR method guide",
            url: "https://www.themuse.com/advice/star-interview-method",
            type: "article",
          },
          {
            title: "Amazon Leadership Principles (adapt anywhere)",
            url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles",
            type: "article",
          },
        ],
        tasks: [
          { id: "sw11-t1", title: "Write 8 STAR stories: Skedpal leadership, migrations, solo launches, AI shipping, conflict, failure", estimatedMinutes: 300 },
          { id: "sw11-t2", title: "Record all 8 stories; tighten each to ≤2 minutes", estimatedMinutes: 150 },
          { id: "sw11-t3", title: "Rewrite resume: every bullet quantified; add AI engineering skills + shipped feature", estimatedMinutes: 150 },
          { id: "sw11-t4", title: "Update LinkedIn headline/About for 'Senior Software Engineer (Full-Stack + AI)'", estimatedMinutes: 90 },
          { id: "sw11-t5", title: "Build target list: 40 remote-friendly companies; note referral paths", estimatedMinutes: 120 },
          { id: "sw11-t6", title: "DSA: maintenance sets — 1 medium daily + review misses", estimatedMinutes: 270 },
        ],
      },
      {
        id: "sw12",
        weekNumber: 12,
        title: "Apply, Interview & Negotiate",
        focus: "Application campaign, live interviews, offer handling, sustain loop",
        dailySplit: "2h applications/outreach · 1.5h interview prep per pipeline · 1.5h skill maintenance",
        topics: [
          "Tailored applications & outreach",
          "Interview scheduling strategy",
          "Negotiation basics",
          "90-day sustain plan",
        ],
        resources: [
          {
            title: "levels.fyi — compensation data",
            url: "https://www.levels.fyi/",
            type: "article",
          },
          {
            title: "Fearless Salary Negotiation",
            url: "https://fearlesssalarynegotiation.com/",
            type: "article",
          },
        ],
        tasks: [
          { id: "sw12-t1", title: "Apply to 25 roles with tailored notes (batch 5/day)", estimatedMinutes: 300 },
          { id: "sw12-t2", title: "Send 10 referral/intro requests with a short pitch", estimatedMinutes: 90 },
          { id: "sw12-t3", title: "2 final full-loop mocks (coding + design + behavioral back-to-back)", estimatedMinutes: 240 },
          { id: "sw12-t4", title: "Prepare negotiation sheet: salary bands, competing-offer scripts", estimatedMinutes: 90 },
          { id: "sw12-t5", title: "Write 90-day sustain plan: 3 coding + 1 design + 1 mock weekly", estimatedMinutes: 60 },
          { id: "sw12-t6", title: "Retrospective: what worked, what to keep drilling between interviews", estimatedMinutes: 60 },
        ],
      },
    ],
  },
];

export function getAllTasks() {
  return LEARNING_CURRICULUM.flatMap((phase) =>
    phase.weeks.flatMap((week) =>
      week.tasks.map((task) => ({
        ...task,
        weekId: week.id,
        weekNumber: week.weekNumber,
        phaseId: phase.id,
      }))
    )
  );
}

export function getTotalTaskCount(): number {
  return getAllTasks().length;
}

export function findWeekByNumber(weekNumber: number) {
  for (const phase of LEARNING_CURRICULUM) {
    const week = phase.weeks.find((w) => w.weekNumber === weekNumber);
    if (week) return { phase, week };
  }
  return null;
}

/** First week that still has incomplete tasks, or the last week if everything is done. */
export function getFocusWeek(completedTaskIds: Set<string>) {
  const tasks = getAllTasks();
  const next = tasks.find((task) => !completedTaskIds.has(task.id));
  if (next) return findWeekByNumber(next.weekNumber);
  const lastPhase = LEARNING_CURRICULUM[LEARNING_CURRICULUM.length - 1];
  const lastWeek = lastPhase.weeks[lastPhase.weeks.length - 1];
  return { phase: lastPhase, week: lastWeek };
}
