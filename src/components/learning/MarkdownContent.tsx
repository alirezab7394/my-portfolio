"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

const components: Components = {
  h1: ({ children }) => <h2 className="mt-6 mb-3 text-xl font-semibold tracking-tight text-foreground first:mt-0">{children}</h2>,
  h2: ({ children }) => <h3 className="mt-6 mb-2 text-lg font-semibold tracking-tight text-foreground first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="mt-4 mb-2 text-base font-semibold text-foreground">{children}</h4>,
  p: ({ children }) => <p className="mb-3 text-[15px] leading-7 text-foreground/90">{children}</p>,
  ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 ps-5 text-[15px] leading-7">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 ps-5 text-[15px] leading-7">{children}</ol>,
  li: ({ children }) => <li className="text-foreground/90">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-s-2 border-primary/40 bg-primary/5 px-3 py-2 text-sm text-foreground/80">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className);
    if (!isBlock) {
      return (
        <code className="break-all rounded bg-muted px-1 py-0.5 font-mono text-[13px]" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={cn("font-mono text-[13px] leading-6", className)} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-4 max-w-full overflow-x-auto rounded-md border bg-secondary-900 p-3 text-secondary-50">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b px-2 py-1.5 text-start font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b px-2 py-1.5 align-top">{children}</td>,
  hr: () => <hr className="my-5 border-border" />,
};

export function MarkdownContent({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  return (
    <div className={cn("study-md min-w-0 max-w-full overflow-x-auto", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
