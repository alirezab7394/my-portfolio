import type { LearningPhase } from "@/types/learning";

/**
 * Adjustable 24-week senior engineer interview path.
 * ~5h/day, 6 days/week. Edit this file anytime — progress is keyed by stable task IDs.
 */
export const LEARNING_CURRICULUM: LearningPhase[] = [
  {
    id: "phase-1",
    number: 1,
    title: "Core JavaScript & the Platform",
    description:
      "Rebuild fundamentals from first principles. Interviewers probe event loop, closures, TypeScript, browser, HTTP, and security — not frameworks.",
    weekRange: [1, 4],
    weeks: [
      {
        id: "w01",
        weekNumber: 1,
        title: "JavaScript Core Mechanics",
        focus: "Execution context, scope, closures, this, prototypes",
        dailySplit:
          "2h theory (read + notes) · 2h code experiments · 1h flashcards / explain-out-loud",
        topics: [
          "Execution context & call stack",
          "Lexical scope & closures",
          "this binding rules",
          "Prototypes & inheritance",
          "Value vs reference",
        ],
        resources: [
          {
            title: "javascript.info — The JavaScript language (Part 1)",
            url: "https://javascript.info/",
            type: "docs",
          },
          {
            title: "MDN — Closures",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures",
            type: "docs",
          },
          {
            title: "Lydia Hallie — JavaScript Visualized: Event Loop, Hoisting, Scope",
            url: "https://www.youtube.com/@lydiahallie",
            type: "video",
          },
          {
            title: "You Don't Know JS (book series) — Scope & Closures",
            url: "https://github.com/getify/You-Dont-Know-JS",
            type: "article",
          },
        ],
        tasks: [
          {
            id: "w01-t1",
            title: "Read javascript.info: Objects, Prototypes, Classes",
            estimatedMinutes: 180,
          },
          {
            id: "w01-t2",
            title: "Write 10 closure examples and explain each out loud",
            estimatedMinutes: 120,
          },
          {
            id: "w01-t3",
            title: "Document this-binding rules with 8 mini demos",
            estimatedMinutes: 90,
          },
          {
            id: "w01-t4",
            title: "Implement a simple EventEmitter from scratch",
            estimatedMinutes: 90,
          },
          {
            id: "w01-t5",
            title: "Flashcards: scope, hoisting, TDZ, prototype chain",
            estimatedMinutes: 60,
          },
          {
            id: "w01-t6",
            title: "Mock Q: Explain closures as if teaching a junior (record yourself)",
            estimatedMinutes: 30,
          },
        ],
      },
      {
        id: "w02",
        weekNumber: 2,
        title: "Async JS, Event Loop & Memory",
        focus: "Promises, microtasks, async/await internals, GC basics",
        dailySplit:
          "2h event-loop deep dive · 2h promise/async drills · 1h memory & debugging",
        topics: [
          "Event loop, macrotasks vs microtasks",
          "Promise internals & chaining",
          "async/await error handling",
          "AbortController & cancellation",
          "Memory leaks in SPAs",
        ],
        resources: [
          {
            title: "Jake Archibald — In The Loop (JSConf)",
            url: "https://www.youtube.com/watch?v=cCOL7MC4Pl0",
            type: "video",
          },
          {
            title: "javascript.info — Promises, async/await",
            url: "https://javascript.info/async",
            type: "docs",
          },
          {
            title: "MDN — Using the Fetch API + AbortController",
            url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
            type: "docs",
          },
          {
            title: "web.dev — Identify memory leaks with Chrome DevTools",
            url: "https://web.dev/articles/memory-leaks",
            type: "article",
          },
        ],
        tasks: [
          {
            id: "w02-t1",
            title: "Draw the event loop; predict output of 15 async snippets",
            estimatedMinutes: 150,
          },
          {
            id: "w02-t2",
            title: "Implement Promise.all / race / allSettled from scratch",
            estimatedMinutes: 120,
          },
          {
            id: "w02-t3",
            title: "Build a retry-with-backoff + AbortController utility",
            estimatedMinutes: 90,
          },
          {
            id: "w02-t4",
            title: "Find & fix a deliberate memory leak in a sample React app",
            estimatedMinutes: 90,
          },
          {
            id: "w02-t5",
            title: "Write notes: when does a Promise settle vs when does await resume?",
            estimatedMinutes: 45,
          },
          {
            id: "w02-t6",
            title: "Mock Q: Explain microtasks vs macrotasks with a whiteboard diagram",
            estimatedMinutes: 30,
          },
        ],
      },
      {
        id: "w03",
        weekNumber: 3,
        title: "TypeScript Type System Depth",
        focus: "Generics, conditional types, utility types, narrowing, satisfies",
        dailySplit:
          "2h TS handbook / type puzzles · 2h refactor real code · 1h interview type questions",
        topics: [
          "Structural typing & excess property checks",
          "Generics & constraints",
          "Discriminated unions & narrowing",
          "Mapped & conditional types",
          "satisfies, const assertions, template literals",
        ],
        resources: [
          {
            title: "TypeScript Handbook",
            url: "https://www.typescriptlang.org/docs/handbook/intro.html",
            type: "docs",
          },
          {
            title: "Total TypeScript — Beginners → Intermediate",
            url: "https://www.totaltypescript.com/",
            type: "course",
          },
          {
            title: "type-challenges (GitHub)",
            url: "https://github.com/type-challenges/type-challenges",
            type: "practice",
          },
          {
            title: "Matt Pocock — TypeScript tips (YouTube)",
            url: "https://www.youtube.com/@mattpocockuk",
            type: "video",
          },
        ],
        tasks: [
          {
            id: "w03-t1",
            title: "Complete TS Handbook: Narrowing, Generics, Utility Types",
            estimatedMinutes: 180,
          },
          {
            id: "w03-t2",
            title: "Solve 15 easy + 10 medium type-challenges",
            estimatedMinutes: 180,
          },
          {
            id: "w03-t3",
            title: "Type a small API client with generics + Result types",
            estimatedMinutes: 120,
          },
          {
            id: "w03-t4",
            title: "Refactor one NestJS DTO / Prisma model typing from your projects",
            estimatedMinutes: 90,
          },
          {
            id: "w03-t5",
            title: "Flashcards: Pick, Omit, Exclude, Extract, Record, Partial, Required",
            estimatedMinutes: 45,
          },
          {
            id: "w03-t6",
            title: "Mock Q: When would you use unknown vs any vs never?",
            estimatedMinutes: 20,
          },
        ],
      },
      {
        id: "w04",
        weekNumber: 4,
        title: "Browser, HTTP, Caching & Security",
        focus: "Rendering pipeline, network, CDN, CORS, XSS, CSRF, CSP",
        dailySplit:
          "2h browser/network theory · 1.5h security labs · 1.5h Core Web Vitals review",
        topics: [
          "Critical rendering path",
          "HTTP/1.1 vs HTTP/2 vs HTTP/3",
          "Caching: Cache-Control, ETag, CDN",
          "CORS, cookies, SameSite",
          "XSS, CSRF, CSP, auth tokens",
        ],
        resources: [
          {
            title: "web.dev — Learn Performance",
            url: "https://web.dev/learn/performance",
            type: "course",
          },
          {
            title: "MDN — HTTP overview & CORS",
            url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
            type: "docs",
          },
          {
            title: "OWASP Top 10 (focus XSS / CSRF / Broken Access)",
            url: "https://owasp.org/www-project-top-ten/",
            type: "article",
          },
          {
            title: "Browser Rendering Optimization (Chrome Developers)",
            url: "https://www.youtube.com/playlist?list=PLNYkxOF6rcICgSEy0RGTvO7hsWOxT8t0A",
            type: "video",
          },
        ],
        tasks: [
          {
            id: "w04-t1",
            title: "Map critical rendering path; audit one page with Lighthouse",
            estimatedMinutes: 120,
          },
          {
            id: "w04-t2",
            title: "Write cheatsheet: Cache-Control directives + when to use each",
            estimatedMinutes: 60,
          },
          {
            id: "w04-t3",
            title: "Explain CORS preflight with a NestJS + Next.js example from your apps",
            estimatedMinutes: 90,
          },
          {
            id: "w04-t4",
            title: "Security review notes for Javi / NextTarget auth (XSS, CSRF, cookies)",
            estimatedMinutes: 120,
          },
          {
            id: "w04-t5",
            title: "Implement a CSP header draft for your portfolio",
            estimatedMinutes: 60,
          },
          {
            id: "w04-t6",
            title: "Mock Q: How do you prevent XSS in a rich-text / markdown feature?",
            estimatedMinutes: 30,
          },
        ],
      },
    ],
  },
  {
    id: "phase-2",
    number: 2,
    title: "Data Structures & Algorithms",
    description:
      "NeetCode 150 order. Daily: ~2.5h problems + 1h theory + review. Target ~250 problems with spaced repetition of misses.",
    weekRange: [5, 12],
    weeks: [
      {
        id: "w05",
        weekNumber: 5,
        title: "Arrays & Hashing",
        focus: "Hash maps, frequency counting, prefix patterns",
        dailySplit: "2.5h LeetCode · 1h pattern notes · 1h review misses",
        topics: ["Two Sum family", "Anagrams / Group Anagrams", "Prefix sums", "Hash set tricks"],
        resources: [
          {
            title: "NeetCode 150 — Arrays & Hashing",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
          {
            title: "NeetCode — Arrays & Hashing playlist",
            url: "https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4BfDsIVyUBD",
            type: "video",
          },
        ],
        tasks: [
          { id: "w05-t1", title: "Solve: Two Sum, Contains Duplicate, Valid Anagram", estimatedMinutes: 120 },
          { id: "w05-t2", title: "Solve: Group Anagrams, Top K Frequent, Product Except Self", estimatedMinutes: 150 },
          { id: "w05-t3", title: "Solve: Encode/Decode Strings, Longest Consecutive Sequence", estimatedMinutes: 120 },
          { id: "w05-t4", title: "Write pattern sheet: when hash map beats sort/two-pointer", estimatedMinutes: 60 },
          { id: "w05-t5", title: "Re-solve all misses under 20 min each (spaced)", estimatedMinutes: 120 },
          { id: "w05-t6", title: "Timed set: 3 mediums in 75 minutes", estimatedMinutes: 75 },
        ],
      },
      {
        id: "w06",
        weekNumber: 6,
        title: "Two Pointers & Sliding Window",
        focus: "In-place arrays, substring windows, rate limiting intuition",
        dailySplit: "2.5h problems · 1h whiteboard · 1h review",
        topics: ["Opposite pointers", "Fast/slow", "Fixed vs variable window", "Monotonic queues intro"],
        resources: [
          {
            title: "NeetCode — Two Pointers & Sliding Window",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
          {
            title: "Sliding Window Technique article",
            url: "https://leetcode.com/discuss/study-guide/1326308/a-comprehensive-guide-and-template-for-sliding-window-based-problems",
            type: "article",
          },
        ],
        tasks: [
          { id: "w06-t1", title: "Solve: Valid Palindrome, Two Sum II, 3Sum", estimatedMinutes: 150 },
          { id: "w06-t2", title: "Solve: Container With Most Water, Trapping Rain Water", estimatedMinutes: 120 },
          { id: "w06-t3", title: "Solve: Best Time to Buy/Sell, Longest Substring Without Repeating", estimatedMinutes: 120 },
          { id: "w06-t4", title: "Solve: Longest Repeating Character Replacement, Min Window Substring", estimatedMinutes: 150 },
          { id: "w06-t5", title: "Template notes: variable window skeleton in TypeScript", estimatedMinutes: 45 },
          { id: "w06-t6", title: "Timed set: 3 mediums in 75 minutes", estimatedMinutes: 75 },
        ],
      },
      {
        id: "w07",
        weekNumber: 7,
        title: "Stacks & Linked Lists",
        focus: "Monotonic stack, parentheses, reverse/merge lists",
        dailySplit: "2.5h problems · 1h draw diagrams · 1h review",
        topics: ["Stack for parsing", "Monotonic stack", "Dummy nodes", "Fast/slow pointers"],
        resources: [
          {
            title: "NeetCode — Stack & Linked List",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
        ],
        tasks: [
          { id: "w07-t1", title: "Solve: Valid Parentheses, Min Stack, Evaluate RPN", estimatedMinutes: 120 },
          { id: "w07-t2", title: "Solve: Daily Temperatures, Car Fleet, Largest Rectangle in Histogram", estimatedMinutes: 150 },
          { id: "w07-t3", title: "Solve: Reverse Linked List, Merge Two Lists, Linked List Cycle", estimatedMinutes: 120 },
          { id: "w07-t4", title: "Solve: Reorder List, Remove Nth Node, LRU Cache (design)", estimatedMinutes: 150 },
          { id: "w07-t5", title: "Implement singly + doubly linked list in TypeScript", estimatedMinutes: 60 },
          { id: "w07-t6", title: "Timed set: 3 mediums in 75 minutes", estimatedMinutes: 75 },
        ],
      },
      {
        id: "w08",
        weekNumber: 8,
        title: "Trees (BST & Binary Trees)",
        focus: "DFS/BFS, recursion trees, BST properties",
        dailySplit: "2.5h problems · 1h recursion drills · 1h review",
        topics: ["Pre/in/post/level order", "BST insert/search/validate", "LCA", "Serialize/deserialize"],
        resources: [
          {
            title: "NeetCode — Trees",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
          {
            title: "Tree traversal visualizations",
            url: "https://visualgo.net/en/bst",
            type: "practice",
          },
        ],
        tasks: [
          { id: "w08-t1", title: "Solve: Invert Tree, Max Depth, Diameter, Balanced Binary Tree", estimatedMinutes: 120 },
          { id: "w08-t2", title: "Solve: Same Tree, Subtree, Lowest Common Ancestor", estimatedMinutes: 120 },
          { id: "w08-t3", title: "Solve: Level Order, Right Side View, Good Nodes Count", estimatedMinutes: 120 },
          { id: "w08-t4", title: "Solve: Validate BST, Kth Smallest, Construct from Preorder/Inorder", estimatedMinutes: 150 },
          { id: "w08-t5", title: "Solve: Binary Tree Max Path Sum, Serialize/Deserialize", estimatedMinutes: 120 },
          { id: "w08-t6", title: "Timed set: 3 mediums in 75 minutes", estimatedMinutes: 75 },
        ],
      },
      {
        id: "w09",
        weekNumber: 9,
        title: "Heaps & Backtracking",
        focus: "Priority queues, permutations, subsets, constraint search",
        dailySplit: "2.5h problems · 1h template writing · 1h review",
        topics: ["Min/max heap", "Top-K patterns", "Subsets/permutations", "N-Queens / Word Search"],
        resources: [
          {
            title: "NeetCode — Heap & Backtracking",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
        ],
        tasks: [
          { id: "w09-t1", title: "Solve: Kth Largest Element, Last Stone Weight, K Closest Points", estimatedMinutes: 120 },
          { id: "w09-t2", title: "Solve: Task Scheduler, Design Twitter, Find Median from Data Stream", estimatedMinutes: 150 },
          { id: "w09-t3", title: "Solve: Subsets, Combination Sum, Permutations", estimatedMinutes: 120 },
          { id: "w09-t4", title: "Solve: Word Search, Palindrome Partitioning, N-Queens", estimatedMinutes: 150 },
          { id: "w09-t5", title: "Write backtracking template + when to prune", estimatedMinutes: 45 },
          { id: "w09-t6", title: "Timed set: 3 mediums in 75 minutes", estimatedMinutes: 75 },
        ],
      },
      {
        id: "w10",
        weekNumber: 10,
        title: "Graphs (BFS/DFS)",
        focus: "Adjacency lists, islands, topo sort, shortest path intro",
        dailySplit: "2.5h problems · 1h graph drawing · 1h review",
        topics: ["BFS vs DFS", "Connected components", "Topological sort", "Dijkstra intro"],
        resources: [
          {
            title: "NeetCode — Graphs",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
          {
            title: "William Fiset — Graph Theory playlist",
            url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsDGOX-HmpcxWu-ZKdEbcOu5",
            type: "video",
          },
        ],
        tasks: [
          { id: "w10-t1", title: "Solve: Number of Islands, Clone Graph, Max Area of Island", estimatedMinutes: 120 },
          { id: "w10-t2", title: "Solve: Pacific Atlantic, Surrounded Regions, Rotting Oranges", estimatedMinutes: 150 },
          { id: "w10-t3", title: "Solve: Course Schedule I & II, Graph Valid Tree", estimatedMinutes: 120 },
          { id: "w10-t4", title: "Solve: Number of Connected Components, Redundant Connection", estimatedMinutes: 90 },
          { id: "w10-t5", title: "Solve: Word Ladder, Network Delay Time (Dijkstra)", estimatedMinutes: 120 },
          { id: "w10-t6", title: "Timed set: 3 mediums in 75 minutes", estimatedMinutes: 75 },
        ],
      },
      {
        id: "w11",
        weekNumber: 11,
        title: "Dynamic Programming I",
        focus: "1D DP: climbing stairs family, knapsack intuition",
        dailySplit: "2.5h DP problems · 1h recurrence writing · 1h review",
        topics: ["Top-down vs bottom-up", "State definition", "Transition", "Base cases"],
        resources: [
          {
            title: "NeetCode — 1-D Dynamic Programming",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
          {
            title: "DP for interviews — Aditya Verma (playlist)",
            url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go",
            type: "video",
          },
        ],
        tasks: [
          { id: "w11-t1", title: "Solve: Climbing Stairs, House Robber I & II, Min Cost Climbing", estimatedMinutes: 120 },
          { id: "w11-t2", title: "Solve: Coin Change, Word Break, Longest Increasing Subsequence", estimatedMinutes: 150 },
          { id: "w11-t3", title: "Solve: Partition Equal Subset Sum, Target Sum", estimatedMinutes: 120 },
          { id: "w11-t4", title: "Solve: Decode Ways, Maximum Product Subarray", estimatedMinutes: 90 },
          { id: "w11-t5", title: "For each solved DP: write state + transition in one sentence", estimatedMinutes: 60 },
          { id: "w11-t6", title: "Timed set: 2 mediums + 1 hard attempt in 90 minutes", estimatedMinutes: 90 },
        ],
      },
      {
        id: "w12",
        weekNumber: 12,
        title: "Dynamic Programming II & Intervals",
        focus: "2D DP, intervals, greedy vs DP decisions",
        dailySplit: "2.5h problems · 1h compare approaches · 1h NeetCode 150 catch-up",
        topics: ["Grid DP", "Edit distance family", "Interval scheduling", "Greedy vs DP"],
        resources: [
          {
            title: "NeetCode — 2-D DP & Intervals",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
        ],
        tasks: [
          { id: "w12-t1", title: "Solve: Unique Paths, Longest Common Subsequence, Edit Distance", estimatedMinutes: 150 },
          { id: "w12-t2", title: "Solve: Best Time to Buy/Sell with Cooldown, Coin Change II", estimatedMinutes: 120 },
          { id: "w12-t3", title: "Solve: Non-overlapping Intervals, Meeting Rooms II pattern", estimatedMinutes: 90 },
          { id: "w12-t4", title: "Catch-up: finish remaining NeetCode 150 from weeks 5–12", estimatedMinutes: 180 },
          { id: "w12-t5", title: "Spaced repetition: re-solve top 20 previous misses", estimatedMinutes: 150 },
          { id: "w12-t6", title: "Mock coding interview (Pramp / peer) — 45 min + debrief", estimatedMinutes: 60 },
        ],
      },
    ],
  },
  {
    id: "phase-3",
    number: 3,
    title: "System Design (Frontend + Backend)",
    description:
      "Frontend system design + classic distributed systems. Turn NextTarget, Javi, and AzarTime into interview-ready design stories.",
    weekRange: [13, 18],
    weeks: [
      {
        id: "w13",
        weekNumber: 13,
        title: "Frontend System Design Foundations",
        focus: "Component architecture, data fetching, state, rendering strategies",
        dailySplit: "2h read/watch · 2h design write-ups · 1h critique",
        topics: [
          "CSR vs SSR vs SSG vs ISR vs RSC",
          "Client vs server state",
          "Caching layers in the frontend",
          "Accessibility & i18n/RTL at scale",
        ],
        resources: [
          {
            title: "GreatFrontEnd — Frontend System Design",
            url: "https://www.greatfrontend.com/frontend-system-design",
            type: "course",
          },
          {
            title: "Next.js docs — Rendering & Caching",
            url: "https://nextjs.org/docs/app/building-your-application/rendering",
            type: "docs",
          },
          {
            title: "web.dev — Patterns for large apps",
            url: "https://web.dev/",
            type: "article",
          },
        ],
        tasks: [
          { id: "w13-t1", title: "Notes: decision matrix for SSR/SSG/ISR/RSC with trade-offs", estimatedMinutes: 90 },
          { id: "w13-t2", title: "Design: Autocomplete search box (debounce, cache, a11y, i18n)", estimatedMinutes: 120 },
          { id: "w13-t3", title: "Design: Feed / infinite scroll (virtualization, offline)", estimatedMinutes: 120 },
          { id: "w13-t4", title: "Map state: Redux vs Zustand vs React Query for a dashboard", estimatedMinutes: 90 },
          { id: "w13-t5", title: "Write architecture notes for Skedpal marketing → Next.js migration", estimatedMinutes: 90 },
          { id: "w13-t6", title: "Mock: 45-min frontend design interview + notes", estimatedMinutes: 60 },
        ],
      },
      {
        id: "w14",
        weekNumber: 14,
        title: "Design Your Own Products (Part 1)",
        focus: "NextTarget & AzarTime as system design case studies",
        dailySplit: "1h theory · 3h design docs · 1h diagram polish",
        topics: ["RBAC", "Payments", "OTP auth", "Job queues", "File storage"],
        resources: [
          {
            title: "ByteByteGo — System Design fundamentals",
            url: "https://bytebytego.com/",
            type: "course",
          },
          {
            title: "Prisma docs — transactions & connection pooling",
            url: "https://www.prisma.io/docs",
            type: "docs",
          },
        ],
        tasks: [
          { id: "w14-t1", title: "Draw NextTarget C4: context + container diagrams", estimatedMinutes: 120 },
          { id: "w14-t2", title: "Write: RBAC model for 4 roles (clients, coaches, supervisors, admins)", estimatedMinutes: 90 },
          { id: "w14-t3", title: "Design: Zarinpal subscription + webhook idempotency", estimatedMinutes: 90 },
          { id: "w14-t4", title: "Design: BullMQ jobs for SMS OTP, abandoned cart, AI reports", estimatedMinutes: 90 },
          { id: "w14-t5", title: "AzarTime: catalog, cart, inventory consistency notes", estimatedMinutes: 90 },
          { id: "w14-t6", title: "Practice 10-min pitch of NextTarget architecture", estimatedMinutes: 30 },
        ],
      },
      {
        id: "w15",
        weekNumber: 15,
        title: "Design Your Own Products (Part 2)",
        focus: "Javi English: multi-tenancy, real-time, AI scoring",
        dailySplit: "1h theory · 3h design docs · 1h interview rehearsal",
        topics: ["Multi-tenancy", "WebSockets", "AI rate limits", "Voice pipeline"],
        resources: [
          {
            title: "System Design Interview — Alex Xu Vol 1 (selected chapters)",
            url: "https://bytebytego.com/",
            type: "article",
          },
          {
            title: "Socket.IO docs — scaling considerations",
            url: "https://socket.io/docs/v4/",
            type: "docs",
          },
        ],
        tasks: [
          { id: "w15-t1", title: "Draw Javi multi-tenancy (schools) + data isolation strategy", estimatedMinutes: 120 },
          { id: "w15-t2", title: "Design: OpenAI scoring pipeline with retries, cost caps, caching", estimatedMinutes: 90 },
          { id: "w15-t3", title: "Design: Socket.IO chat rooms + presence", estimatedMinutes: 90 },
          { id: "w15-t4", title: "Design: Whisper/FastAPI voice assessment flow", estimatedMinutes: 90 },
          { id: "w15-t5", title: "Write STAR story: hardest bug / scaling decision on Javi", estimatedMinutes: 60 },
          { id: "w15-t6", title: "Mock: design an EdTech exam platform in 45 minutes", estimatedMinutes: 60 },
        ],
      },
      {
        id: "w16",
        weekNumber: 16,
        title: "Classic System Design I",
        focus: "URL shortener, rate limiter, notification system",
        dailySplit: "2h video/book · 2h design practice · 1h capacity math",
        topics: ["API design", "Hashing / sharding", "Rate limiting", "Fan-out"],
        resources: [
          {
            title: "NeetCode — System Design playlist",
            url: "https://www.youtube.com/@NeetCodeIO",
            type: "video",
          },
          {
            title: "Jordan has no life — System Design",
            url: "https://www.youtube.com/@JordanHasNoLife",
            type: "video",
          },
          {
            title: "ByteByteGo YouTube",
            url: "https://www.youtube.com/@ByteByteGo",
            type: "video",
          },
        ],
        tasks: [
          { id: "w16-t1", title: "Design URL shortener (API, DB, hash, redirects)", estimatedMinutes: 120 },
          { id: "w16-t2", title: "Design rate limiter (token bucket / sliding window + Redis)", estimatedMinutes: 90 },
          { id: "w16-t3", title: "Design notification system (email/SMS/push, queues)", estimatedMinutes: 120 },
          { id: "w16-t4", title: "Capacity estimation worksheet for each design", estimatedMinutes: 60 },
          { id: "w16-t5", title: "Compare your NestJS+Redis choices vs interview textbook answers", estimatedMinutes: 60 },
          { id: "w16-t6", title: "Mock 45-min system design + record yourself", estimatedMinutes: 60 },
        ],
      },
      {
        id: "w17",
        weekNumber: 17,
        title: "Classic System Design II",
        focus: "News feed, chat, search, CDN",
        dailySplit: "2h theory · 2h design · 1h trade-off debates",
        topics: ["Fan-out on write/read", "Consistent hashing", "Search indexing", "CDN & edge"],
        resources: [
          {
            title: "System Design Interview Vol 2 — selected chapters",
            url: "https://bytebytego.com/",
            type: "article",
          },
        ],
        tasks: [
          { id: "w17-t1", title: "Design news feed (timeline generation strategies)", estimatedMinutes: 120 },
          { id: "w17-t2", title: "Design chat (1:1 + group) with delivery guarantees", estimatedMinutes: 120 },
          { id: "w17-t3", title: "Design product search (indexing, ranking basics)", estimatedMinutes: 90 },
          { id: "w17-t4", title: "Notes: CDN, edge caching, image pipeline (S3/MinIO)", estimatedMinutes: 60 },
          { id: "w17-t5", title: "Whiteboard: how Torob feed / catalog sync would scale for AzarTime", estimatedMinutes: 60 },
          { id: "w17-t6", title: "Mock 45-min design interview", estimatedMinutes: 60 },
        ],
      },
      {
        id: "w18",
        weekNumber: 18,
        title: "Databases, Consistency & Observability",
        focus: "SQL vs NoSQL, indexes, transactions, monitoring",
        dailySplit: "2h DB theory · 2h Prisma/SQL practice · 1h observability notes",
        topics: [
          "Indexes & query plans",
          "ACID vs BASE",
          "Caching with Redis",
          "Logging, metrics, tracing",
        ],
        resources: [
          {
            title: "Use The Index, Luke",
            url: "https://use-the-index-luke.com/",
            type: "article",
          },
          {
            title: "PostgreSQL docs — Indexes",
            url: "https://www.postgresql.org/docs/current/indexes.html",
            type: "docs",
          },
          {
            title: "Prisma — Optimize query performance",
            url: "https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance",
            type: "docs",
          },
        ],
        tasks: [
          { id: "w18-t1", title: "Explain B-tree indexes; write EXPLAIN ANALYZE on 3 queries", estimatedMinutes: 120 },
          { id: "w18-t2", title: "Notes: when Redis vs Postgres for sessions, rate limits, caches", estimatedMinutes: 60 },
          { id: "w18-t3", title: "Design idempotent payment webhook table + unique constraints", estimatedMinutes: 90 },
          { id: "w18-t4", title: "Draft observability stack for NestJS monorepo (logs/metrics)", estimatedMinutes: 90 },
          { id: "w18-t5", title: "CAP theorem examples mapped to your SaaS features", estimatedMinutes: 45 },
          { id: "w18-t6", title: "Mock: database design for a multi-tenant SaaS", estimatedMinutes: 60 },
        ],
      },
    ],
  },
  {
    id: "phase-4",
    number: 4,
    title: "React Internals, Behavioral & Job Hunt",
    description:
      "React/Fiber depth, STAR stories from your experience, English interview drills, mocks, and applications.",
    weekRange: [19, 24],
    weeks: [
      {
        id: "w19",
        weekNumber: 19,
        title: "React Internals & Performance",
        focus: "Reconciliation, Fiber, hooks rules, memoization, concurrent features",
        dailySplit: "2h theory · 2h profiling labs · 1h interview Qs",
        topics: ["Virtual DOM myth vs Fiber", "Render vs commit", "useEffect pitfalls", "RSC boundaries"],
        resources: [
          {
            title: "React docs — Escape Hatches & Performance",
            url: "https://react.dev/learn",
            type: "docs",
          },
          {
            title: "A Complete Guide to useEffect (Dan Abramov)",
            url: "https://overreacted.io/a-complete-guide-to-useeffect/",
            type: "article",
          },
          {
            title: "React Fiber architecture notes",
            url: "https://github.com/acdlite/react-fiber-architecture",
            type: "article",
          },
        ],
        tasks: [
          { id: "w19-t1", title: "Notes: render phase vs commit phase; what triggers re-render", estimatedMinutes: 90 },
          { id: "w19-t2", title: "Lab: profile a list with React DevTools; fix unnecessary renders", estimatedMinutes: 120 },
          { id: "w19-t3", title: "Explain keys, reconciliation, and why index keys bite", estimatedMinutes: 45 },
          { id: "w19-t4", title: "Write: when memo/useMemo/useCallback help vs hurt", estimatedMinutes: 60 },
          { id: "w19-t5", title: "Notes: Server Components vs Client Components boundaries", estimatedMinutes: 90 },
          { id: "w19-t6", title: "Mock Q bank: 20 React interview questions answered aloud", estimatedMinutes: 90 },
        ],
      },
      {
        id: "w20",
        weekNumber: 20,
        title: "Testing, CI/CD & Engineering Quality",
        focus: "RTL, Jest/Vitest, Cypress, GitHub Actions, code review",
        dailySplit: "2h testing practice · 2h CI notes · 1h code review drills",
        topics: ["Testing pyramid", "MSW", "E2E vs integration", "PR review habits"],
        resources: [
          {
            title: "Testing Library docs",
            url: "https://testing-library.com/docs/react-testing-library/intro/",
            type: "docs",
          },
          {
            title: "Kent C. Dodds — Testing JavaScript",
            url: "https://testingjavascript.com/",
            type: "course",
          },
          {
            title: "GitHub Actions docs",
            url: "https://docs.github.com/en/actions",
            type: "docs",
          },
        ],
        tasks: [
          { id: "w20-t1", title: "Add RTL tests for 3 critical components from a side project", estimatedMinutes: 150 },
          { id: "w20-t2", title: "Write a Cypress smoke flow for login → dashboard", estimatedMinutes: 120 },
          { id: "w20-t3", title: "Draft CI workflow: lint, typecheck, test, build", estimatedMinutes: 90 },
          { id: "w20-t4", title: "Code review checklist for senior frontend PRs", estimatedMinutes: 45 },
          { id: "w20-t5", title: "Notes: TDD example on a small utility", estimatedMinutes: 60 },
          { id: "w20-t6", title: "Mock: how do you ensure quality on a team of 3–5?", estimatedMinutes: 30 },
        ],
      },
      {
        id: "w21",
        weekNumber: 21,
        title: "Behavioral Stories (STAR)",
        focus: "Mine Skedpal + solo projects into crisp STAR answers",
        dailySplit: "2h write stories · 2h practice aloud · 1h refine English",
        topics: [
          "Leadership & conflict",
          "Ambiguity & trade-offs",
          "Failure & learning",
          "Impact metrics",
        ],
        resources: [
          {
            title: "Amazon Leadership Principles (adapt for any company)",
            url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles",
            type: "article",
          },
          {
            title: "STAR method overview",
            url: "https://www.themuse.com/advice/star-interview-method",
            type: "article",
          },
        ],
        tasks: [
          { id: "w21-t1", title: "STAR: led team of 3 on Skedpal — delivery under ambiguity", estimatedMinutes: 60 },
          { id: "w21-t2", title: "STAR: WordPress → Next.js migration (30% faster) trade-offs", estimatedMinutes: 60 },
          { id: "w21-t3", title: "STAR: jQuery → React + 40% bundle reduction", estimatedMinutes: 60 },
          { id: "w21-t4", title: "STAR: shipping NextTarget solo — scoping, risk, launch", estimatedMinutes: 60 },
          { id: "w21-t5", title: "STAR: conflict / disagreement / mentoring a junior", estimatedMinutes: 60 },
          { id: "w21-t6", title: "Record 6 stories; tighten each to ≤2 minutes", estimatedMinutes: 90 },
        ],
      },
      {
        id: "w22",
        weekNumber: 22,
        title: "English Interview Drills",
        focus: "Fluency under pressure; explain technical topics clearly",
        dailySplit: "2h speaking drills · 2h mock answers · 1h vocabulary",
        topics: ["Explain systems simply", "Clarify requirements", "Think aloud coding", "Ask good questions"],
        resources: [
          {
            title: "Pramp — mock interviews",
            url: "https://www.pramp.com/",
            type: "practice",
          },
          {
            title: "Interviewing.io (if available)",
            url: "https://interviewing.io/",
            type: "practice",
          },
        ],
        tasks: [
          { id: "w22-t1", title: "Explain event loop in plain English (2 min recording)", estimatedMinutes: 30 },
          { id: "w22-t2", title: "Explain SSR vs RSC to a non-expert PM (2 min)", estimatedMinutes: 30 },
          { id: "w22-t3", title: "Practice clarifying questions for a vague design prompt", estimatedMinutes: 45 },
          { id: "w22-t4", title: "Think-aloud: solve Two Sum + LRU Cache while speaking", estimatedMinutes: 90 },
          { id: "w22-t5", title: "Full mock behavioral interview with peer / Pramp", estimatedMinutes: 60 },
          { id: "w22-t6", title: "Build personal glossary: 40 phrases for interviews", estimatedMinutes: 60 },
        ],
      },
      {
        id: "w23",
        weekNumber: 23,
        title: "Weekly Mocks + Weak Spot Attack",
        focus: "Alternate coding / design / behavioral mocks; patch gaps",
        dailySplit: "1 mock (45–60m) · 2h weak topic · 1h review · 1h applications prep",
        topics: ["Mixed mocks", "Error analysis", "Resume bullets with metrics"],
        resources: [
          {
            title: "NeetCode blind 75 review",
            url: "https://neetcode.io/practice",
            type: "practice",
          },
          {
            title: "GreatFrontEnd quiz / interviews",
            url: "https://www.greatfrontend.com/",
            type: "practice",
          },
        ],
        tasks: [
          { id: "w23-t1", title: "Mock coding interview #1 + written postmortem", estimatedMinutes: 90 },
          { id: "w23-t2", title: "Mock system design #1 + written postmortem", estimatedMinutes: 90 },
          { id: "w23-t3", title: "Mock coding interview #2 (harder)", estimatedMinutes: 90 },
          { id: "w23-t4", title: "Attack top 5 weak algorithm patterns for 4 hours total", estimatedMinutes: 240 },
          { id: "w23-t5", title: "Polish resume bullets with quantified outcomes", estimatedMinutes: 90 },
          { id: "w23-t6", title: "Update LinkedIn headline / About to match target roles", estimatedMinutes: 60 },
        ],
      },
      {
        id: "w24",
        weekNumber: 24,
        title: "Applications, Offers & Sustain Loop",
        focus: "Apply deliberately; keep a sustainable study cadence",
        dailySplit: "2h applications · 2h skill maintain · 1h reflection",
        topics: ["Target companies", "Referral strategy", "Negotiation basics", "Ongoing practice"],
        resources: [
          {
            title: "levels.fyi — compensation context",
            url: "https://www.levels.fyi/",
            type: "article",
          },
          {
            title: "Fearless Salary Negotiation (skim)",
            url: "https://fearlesssalarynegotiation.com/",
            type: "article",
          },
        ],
        tasks: [
          { id: "w24-t1", title: "Build target list: 30 companies / roles (remote-friendly)", estimatedMinutes: 90 },
          { id: "w24-t2", title: "Apply to 10 roles with tailored notes (this week)", estimatedMinutes: 180 },
          { id: "w24-t3", title: "Ask 5 people for referrals / intros", estimatedMinutes: 60 },
          { id: "w24-t4", title: "Schedule recurring weekly: 3 coding + 1 design + 1 mock", estimatedMinutes: 45 },
          { id: "w24-t5", title: "Negotiation cheat sheet for senior frontend offers", estimatedMinutes: 60 },
          { id: "w24-t6", title: "Retrospective: what to keep studying next 90 days", estimatedMinutes: 45 },
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
