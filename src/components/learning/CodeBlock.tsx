"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TokenKind = "comment" | "string" | "keyword" | "number" | "type" | "fn" | "plain";

interface Token {
  kind: TokenKind;
  text: string;
}

const KEYWORDS =
  /^(const|let|var|function|return|if|else|for|while|do|async|await|import|export|from|type|interface|class|extends|implements|new|throw|try|catch|finally|switch|case|break|continue|default|typeof|instanceof|in|of|as|satisfies|keyof|infer|never|unknown|any|void|this|super|public|private|protected|readonly|static|get|set|constructor|yield|delete|enum|namespace|module|declare|abstract|override|true|false|null|undefined|NaN|Infinity)\b/;

const LANGUAGE_LABELS: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  jsx: "JSX",
  javascript: "JavaScript",
  typescript: "TypeScript",
  json: "JSON",
  bash: "Bash",
  sh: "Shell",
  css: "CSS",
  html: "HTML",
  sql: "SQL",
  python: "Python",
  py: "Python",
  text: "Plain text",
  plaintext: "Plain text",
};

function languageLabel(language: string): string {
  if (!language) return "Code";
  return LANGUAGE_LABELS[language.toLowerCase()] ?? language.toUpperCase();
}

function shouldHighlight(language: string, code: string): boolean {
  const lang = language.toLowerCase();
  if (["text", "plaintext", "ascii", "diagram"].includes(lang)) return false;
  if (["js", "javascript", "ts", "typescript", "tsx", "jsx", "json", "bash", "sh"].includes(lang)) return true;
  if (!lang && /=>|\bconst\b|\bfunction\b|\bimport\b/.test(code)) return true;
  return false;
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < code.length) {
    const slice = code.slice(i);
    if (slice.startsWith("//")) {
      const end = slice.indexOf("\n");
      const text = end === -1 ? slice : slice.slice(0, end);
      tokens.push({ kind: "comment", text });
      i += text.length;
      continue;
    }
    if (slice.startsWith("/*")) {
      const end = slice.indexOf("*/");
      const text = end === -1 ? slice : slice.slice(0, end + 2);
      tokens.push({ kind: "comment", text });
      i += text.length;
      continue;
    }
    const quote = slice[0];
    if (quote === "'" || quote === '"' || quote === "`") {
      let j = 1;
      while (j < slice.length) {
        if (slice[j] === "\\") {
          j += 2;
          continue;
        }
        if (slice[j] === quote) {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ kind: "string", text: slice.slice(0, j) });
      i += j;
      continue;
    }
    const keyword = slice.match(KEYWORDS);
    if (keyword) {
      tokens.push({ kind: "keyword", text: keyword[0] });
      i += keyword[0].length;
      continue;
    }
    const number = slice.match(/^\d+(?:\.\d+)?/);
    if (number) {
      tokens.push({ kind: "number", text: number[0] });
      i += number[0].length;
      continue;
    }
    const ident = slice.match(/^[A-Za-z_$][\w$]*/);
    if (ident) {
      const nextNonSpace = slice.slice(ident[0].length).match(/^\s*/)?.[0].length ?? 0;
      const after = slice[ident[0].length + nextNonSpace];
      const kind: TokenKind = /^[A-Z]/.test(ident[0]) ? "type" : after === "(" ? "fn" : "plain";
      tokens.push({ kind, text: ident[0] });
      i += ident[0].length;
      continue;
    }
    tokens.push({ kind: "plain", text: slice[0] });
    i += 1;
  }
  return tokens;
}

function tokensToLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    const parts = token.text.split("\n");
    parts.forEach((part, index) => {
      if (index > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ kind: token.kind, text: part });
    });
  }
  return lines;
}

const TOKEN_CLASS: Record<TokenKind, string> = {
  comment: "text-[#7aa8b5]",
  string: "text-[#9ee0c5]",
  keyword: "text-[#7ec8e3]",
  number: "text-[#f0c674]",
  type: "text-[#b7d9ee]",
  fn: "text-[#e8f4f8]",
  plain: "text-[#e4eef2]",
};

export function CodeBlock({ code, language = "" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const highlight = shouldHighlight(language, code);
  const lines = highlight ? tokensToLines(tokenize(code)) : code.split("\n").map((text) => [{ kind: "plain" as const, text }]);
  const numbered = lines.length > 1 && highlight;
  const label = languageLabel(language);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard can fail on insecure contexts
    }
  }

  return (
    <figure className="study-code mb-5 max-w-full overflow-hidden rounded-xl border border-primary-800/70 bg-[#07161c] shadow-[0_8px_30px_-18px_rgba(8,31,34,0.85)]">
      <figcaption className="flex items-center gap-2 border-b border-white/8 bg-[#0c2f32] px-3 py-2">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-primary-400/90" />
          <span className="size-2 rounded-full bg-primary-200/70" />
          <span className="size-2 rounded-full bg-primary-700/80" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium tracking-wide text-primary-100/85">
          {label}
        </span>
        <button
          type="button"
          onClick={() => void copy()}
          onPointerDown={(event) => event.stopPropagation()}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-primary-100/80 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="max-w-full overflow-x-auto p-3 sm:p-4">
        <code className={cn("block font-mono text-[12.5px] leading-6", numbered && "min-w-max")}>
          {lines.map((line, index) => (
            <span key={index} className="flex min-h-[1.5rem]">
              {numbered ? (
                <span className="w-8 shrink-0 select-none pr-3 text-right text-[11px] tabular-nums text-[#5e8894]">
                  {index + 1}
                </span>
              ) : null}
              <span className="whitespace-pre text-[#e4eef2]">
                {line.length === 0 || (line.length === 1 && line[0].text === "")
                  ? "\u00a0"
                  : line.map((token, tokenIndex) => (
                      <span key={tokenIndex} className={TOKEN_CLASS[token.kind]}>
                        {token.text}
                      </span>
                    ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
