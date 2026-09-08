"use client";

import { Children, isValidElement, type ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/learning/CodeBlock";
import { cn } from "@/lib/utils";

function codeText(children: ReactNode): string {
  return String(children ?? "").replace(/\n$/, "");
}

function extractPreCode(children: ReactNode): { language: string; code: string } {
  let language = "";
  let code = "";
  Children.forEach(children, (child) => {
    if (!isValidElement<{ className?: string; children?: ReactNode }>(child)) {
      code += String(child ?? "");
      return;
    }
    const className = child.props.className ?? "";
    language = /language-([\w-]+)/.exec(className)?.[1] ?? language;
    code += codeText(child.props.children);
  });
  return { language, code };
}

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
  code: ({ className, children }) => {
    if (className?.includes("language-") || codeText(children).includes("\n")) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="rounded-md border border-primary-100 bg-primary-50 px-1.5 py-0.5 font-mono text-[12.5px] text-primary-800">
        {children}
      </code>
    );
  },
  pre: ({ children }) => {
    const { language, code } = extractPreCode(children);
    return <CodeBlock language={language} code={code} />;
  },
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
