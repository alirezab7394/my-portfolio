export type DrillArea =
  | "js"
  | "react"
  | "backend"
  | "db"
  | "ai"
  | "design"
  | "dsa"
  | "behavioral"
  | "english";

export type InterviewDrill = {
  id: string;
  area: DrillArea;
  weeks: number[];
  question: string;
  talkingPoints: string[];
  resourceUrl: string;
  resourceTitle: string;
};

export type StarStory = {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  interviewCue: string;
};

/** Rotating senior-level questions grounded in Alireza's stack and products. */
export const INTERVIEW_DRILLS: InterviewDrill[] = [
  {
    id: "d-event-loop",
    area: "js",
    weeks: [1],
    question: "Walk through the output of mixing Promise.then, queueMicrotask, setTimeout, and a click handler. Why?",
    talkingPoints: [
      "Call stack runs to completion",
      "Microtasks drain after each task, before rendering",
      "UI click is a macrotask; promises are microtasks",
      "Starvation risk if you infinitely enqueue microtasks",
    ],
    resourceUrl: "https://www.youtube.com/watch?v=cCOL7MC4Pl0",
    resourceTitle: "Jake Archibald — In The Loop",
  },
  {
    id: "d-closures",
    area: "js",
    weeks: [1],
    question: "How would you implement a private counter and a once(fn) utility with closures? What gets retained in memory?",
    talkingPoints: ["Lexical environment", "Module vs function scope", "Stale closures in React", "GC of closed-over objects"],
    resourceUrl: "https://javascript.info/closure",
    resourceTitle: "javascript.info — Closures",
  },
  {
    id: "d-ts-unknown",
    area: "js",
    weeks: [1],
    question: "When do you use unknown vs any vs never vs unknown + type guards in an API client?",
    talkingPoints: ["unknown forces narrowing", "never for exhaustiveness", "Zod parse at the boundary", "Don't leak any into UI"],
    resourceUrl: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
    resourceTitle: "TS Handbook — Narrowing",
  },
  {
    id: "d-url-bar",
    area: "js",
    weeks: [2],
    question: "What happens after the user types a URL and hits enter, until first paint?",
    talkingPoints: ["DNS, TCP/TLS, HTTP", "HTML parse, CSSOM, render tree", "JS blocking, preload scanner", "LCP vs FCP"],
    resourceUrl: "https://web.dev/learn/performance",
    resourceTitle: "web.dev — Learn Performance",
  },
  {
    id: "d-cors-cookies",
    area: "js",
    weeks: [2],
    question: "SPA on app.example.com calls api.example.com with cookies. What breaks, and how do you fix it safely?",
    talkingPoints: ["SameSite, Secure, HttpOnly", "CORS ACAO vs credentials", "CSRF if you use cookies", "Prefer BFF or SameSite=Lax + CSRF token"],
    resourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS",
    resourceTitle: "MDN — CORS",
  },
  {
    id: "d-xss",
    area: "js",
    weeks: [2],
    question: "Javi has rich IELTS answers. How do you prevent XSS without breaking Farsi/RTL markdown?",
    talkingPoints: ["Sanitize HTML (DOMPurify)", "CSP default-src", "Never dangerouslySetInnerHTML with model output", "Markdown → sanitized HTML"],
    resourceUrl: "https://owasp.org/www-community/attacks/xss/",
    resourceTitle: "OWASP — XSS",
  },
  {
    id: "d-rerender",
    area: "react",
    weeks: [3],
    question: "A list of 500 workout rows re-renders on every keystroke. How do you find and fix it?",
    talkingPoints: ["React DevTools highlight updates", "State too high", "Unstable props/functions", "virtualization", "memo only after measuring"],
    resourceUrl: "https://react.dev/learn/escape-hatches",
    resourceTitle: "react.dev — Escape hatches",
  },
  {
    id: "d-rsc",
    area: "react",
    weeks: [3],
    question: "When would you keep a dashboard in Client Components vs move data fetching to Server Components?",
    talkingPoints: ["Mutability and interactivity", "Secrets stay on server", "Cache and revalidate", "Don't fetch in useEffect if RSC can do it"],
    resourceUrl: "https://nextjs.org/docs/app/building-your-application/rendering",
    resourceTitle: "Next.js — Rendering",
  },
  {
    id: "d-jwt-session",
    area: "backend",
    weeks: [4],
    question: "JWT in localStorage vs httpOnly cookie session for NextTarget roles. Pick one and defend it.",
    talkingPoints: ["XSS steals localStorage JWT", "Cookie + CSRF", "Refresh rotation", "RBAC claims vs DB lookup per request"],
    resourceUrl: "https://docs.nestjs.com/security/authentication",
    resourceTitle: "NestJS — Authentication",
  },
  {
    id: "d-idempotency",
    area: "backend",
    weeks: [4, 5],
    question: "Zarinpal may retry a payment webhook. How do you make credit exactly once?",
    talkingPoints: ["Idempotency key unique constraint", "Process → persist status atomically", "Outbox for side effects", "Never trust 'success' twice"],
    resourceUrl: "https://www.prisma.io/docs/orm/prisma-client/queries/transactions",
    resourceTitle: "Prisma — Transactions",
  },
  {
    id: "d-slow-query",
    area: "db",
    weeks: [5],
    question: "Admin orders page is slow at 50k rows. Walk me through debugging in Postgres.",
    talkingPoints: ["EXPLAIN ANALYZE", "Missing index vs wrong index", "SELECT *", "pagination keyset vs OFFSET", "N+1 from Prisma include"],
    resourceUrl: "https://use-the-index-luke.com/",
    resourceTitle: "Use The Index, Luke",
  },
  {
    id: "d-isolation",
    area: "db",
    weeks: [5],
    question: "Two coaches update the same program. Which isolation level, and what anomaly do you accept?",
    talkingPoints: ["Read committed vs repeatable read", "Lost update", "Optimistic version column", "SELECT FOR UPDATE sparingly"],
    resourceUrl: "https://www.postgresql.org/docs/current/transaction-iso.html",
    resourceTitle: "Postgres — Isolation",
  },
  {
    id: "d-rate-limit",
    area: "design",
    weeks: [6],
    question: "Design a rate limiter for OpenAI calls on Javi so one school cannot burn the budget.",
    talkingPoints: ["Token bucket per tenant", "Redis INCR + TTL", "Queue + priority", "Hard monthly cap", "Fail open vs fail closed"],
    resourceUrl: "https://www.youtube.com/@ByteByteGo",
    resourceTitle: "ByteByteGo",
  },
  {
    id: "d-url-shortener",
    area: "design",
    weeks: [6],
    question: "Design a URL shortener. Include hash collisions, 301 vs 302, and read-heavy scaling.",
    talkingPoints: ["Base62 id", "cache popular keys", "partition by hash", "analytics async", "custom aliases unique"],
    resourceUrl: "https://github.com/donnemartin/system-design-primer",
    resourceTitle: "System Design Primer",
  },
  {
    id: "d-prompt-injection",
    area: "ai",
    weeks: [7],
    question: "A student pastes 'ignore previous instructions' into Javi speaking practice. What do you do?",
    talkingPoints: ["Separate system vs user", "Never execute tools from raw user text without allowlist", "Output filter", "Don't put secrets in the prompt"],
    resourceUrl: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
    resourceTitle: "OWASP LLM Top 10",
  },
  {
    id: "d-structured-output",
    area: "ai",
    weeks: [7],
    question: "How do you get a reliable JSON score object from an LLM for IELTS writing?",
    talkingPoints: ["JSON schema / structured outputs", "Zod validate", "Retry on parse fail", "Deterministic rubric in system prompt"],
    resourceUrl: "https://platform.openai.com/docs/guides/structured-outputs",
    resourceTitle: "OpenAI — Structured outputs",
  },
  {
    id: "d-rag-vs-prompt",
    area: "ai",
    weeks: [8],
    question: "Would you RAG AzarTime product Q&A or stuff the catalog into the prompt? Trade-offs?",
    talkingPoints: ["Token cost", "Freshness", "Filters + metadata", "Hybrid search", "Eval retrieval hit rate"],
    resourceUrl: "https://www.anthropic.com/news/contextual-retrieval",
    resourceTitle: "Anthropic — Contextual retrieval",
  },
  {
    id: "d-evals",
    area: "ai",
    weeks: [9],
    question: "Ship an eval harness for Javi scoring. What is in the golden set?",
    talkingPoints: ["20–50 labeled essays", "Exact match + LLM-as-judge", "Regression in CI", "Slice by language (FA/EN)"],
    resourceUrl: "https://www.anthropic.com/research/building-effective-agents",
    resourceTitle: "Building effective agents",
  },
  {
    id: "d-lru",
    area: "dsa",
    weeks: [3, 7, 10],
    question: "Implement LRU Cache. Why HashMap + doubly linked list? Complexity of get/put?",
    talkingPoints: ["O(1) move-to-head", "Tail is LRU", "Capacity eviction", "Don't fake it with Array.shift"],
    resourceUrl: "https://neetcode.io/problems/lru-cache",
    resourceTitle: "NeetCode — LRU Cache",
  },
  {
    id: "d-graphs",
    area: "dsa",
    weeks: [5, 10],
    question: "Course Schedule: when BFS Kahn vs DFS cycle detect? How do you explain it on a whiteboard?",
    talkingPoints: ["Indegree queue", "Need topological order → Kahn", "Only cycle? DFS colors", "Build adjacency first"],
    resourceUrl: "https://neetcode.io/problems/course-schedule",
    resourceTitle: "NeetCode — Course Schedule",
  },
  {
    id: "d-conflict",
    area: "behavioral",
    weeks: [11, 12],
    question: "Tell me about a time you disagreed with a product or engineering decision.",
    talkingPoints: ["STAR", "Data not ego", "You still shipped", "What you would repeat"],
    resourceUrl: "https://www.themuse.com/advice/star-interview-method",
    resourceTitle: "STAR method",
  },
  {
    id: "d-ambiguity",
    area: "behavioral",
    weeks: [11, 12],
    question: "Skedpal scope was unclear. How did you lead 3 engineers without thrashing?",
    talkingPoints: ["Clarify outcome", "Slice MVP", "Cadence of review", "Protect focus"],
    resourceUrl: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles",
    resourceTitle: "Leadership principles (adapt)",
  },
  {
    id: "d-english-event-loop",
    area: "english",
    weeks: [1, 10, 11],
    question: "Explain the event loop in 90 seconds, as if the interviewer is a backend engineer.",
    talkingPoints: ["One thread", "Queue of work", "Promises jump the line", "Don't block the thread"],
    resourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
    resourceTitle: "MDN — Event loop",
  },
  {
    id: "d-english-ssr",
    area: "english",
    weeks: [3, 10],
    question: "Explain SSR vs RSC to a product manager in 2 minutes with a Skedpal marketing-site example.",
    talkingPoints: ["HTML on first response", "SEO and LCP", "RSC = server components without extra round trip", "Trade-off: TTFB vs interactivity"],
    resourceUrl: "https://nextjs.org/docs/app/building-your-application/rendering",
    resourceTitle: "Next.js rendering",
  },
];

export const STAR_STORIES: StarStory[] = [
  {
    id: "star-skedpal-next",
    title: "WordPress → Next.js (Skedpal)",
    situation: "Marketing site was WordPress, slow Core Web Vitals, hard for the team to iterate.",
    task: "Lead migration without pausing campaigns.",
    action: "Rebuilt in Next.js, set CWV budgets, code review bar, mentored 3 engineers.",
    result: "About 30% faster load, better LCP/FCP, team owned the stack.",
    interviewCue: "Leadership + performance. Quote the 30% and the team size.",
  },
  {
    id: "star-jquery-react",
    title: "jQuery → React bundle cut",
    situation: "Legacy jQuery frontend, large JS payload.",
    task: "Modernize without a big-bang rewrite freeze.",
    action: "Componentized in React, code-split, killed dead plugins.",
    result: "About 40% smaller JS bundle.",
    interviewCue: "Technical taste + incremental delivery.",
  },
  {
    id: "star-nexttarget",
    title: "Shipped NextTarget solo",
    situation: "Needed a Farsi-first coaching platform with 4 roles and payments.",
    task: "Scope, build, launch, and operate as sole engineer.",
    action: "NestJS RBAC, Prisma/Postgres, Redis jobs, Expo app, AI reports, Zarinpal.",
    result: "Production system with real gym workflows (QR, OTP, programs).",
    interviewCue: "Ownership, scoping risk, full-stack + mobile.",
  },
  {
    id: "star-javi-ai",
    title: "Javi AI scoring in production",
    situation: "IELTS product needed writing/speaking feedback at school scale.",
    task: "Add OpenAI scoring without blowing cost or quality.",
    action: "Rubrics, retries, tenancy isolation, Whisper pipeline, eval mindset.",
    result: "Working multi-sided SaaS with AI as a feature, not a demo.",
    interviewCue: "AI engineering + multi-tenant reality.",
  },
  {
    id: "star-azartime",
    title: "AzarTime commerce ops",
    situation: "Luxury watch retail needed catalog, checkout, campaigns, feeds.",
    task: "Deliver admin + storefront with Iranian payments and SEO feed.",
    action: "Checkout, coupons, S3, Torob feed, abandoned-cart jobs.",
    result: "Live store with operational admin tools.",
    interviewCue: "E-commerce consistency, jobs, integrations.",
  },
];

export const ENGLISH_CUES = [
  "The trade-off here is X versus Y. I would pick X because…",
  "Let me restate the problem to make sure I understood.",
  "A simpler approach would be… The production approach is… because of scale.",
  "I have not used that library in production, but the idea is similar to…",
  "The failure mode I worry about is… Here is how I would observe it.",
  "In my Skedpal / Javi / NextTarget work, a similar constraint was…",
];

export function getDailyDrill(weekNumber: number, date = new Date()): InterviewDrill {
  const pool = INTERVIEW_DRILLS.filter((d) => d.weeks.includes(weekNumber));
  const list = pool.length > 0 ? pool : INTERVIEW_DRILLS;
  const idx = (date.getFullYear() + date.getMonth() + date.getDate() + weekNumber) % list.length;
  return list[idx];
}

export function getDailyEnglishCue(date = new Date()): string {
  return ENGLISH_CUES[date.getDate() % ENGLISH_CUES.length];
}

export function getStarForWeek(weekNumber: number): StarStory {
  if (weekNumber >= 11) return STAR_STORIES[0];
  if (weekNumber >= 9) return STAR_STORIES[3];
  if (weekNumber >= 6) return STAR_STORIES[2];
  if (weekNumber >= 4) return STAR_STORIES[4];
  return STAR_STORIES[1];
}
