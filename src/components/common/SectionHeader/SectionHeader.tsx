import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  children?: ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  children,
}: SectionHeaderProps) {
  return (
    <div className={cn("text-center mb-20", className)}>
      <div className="inline-block">
        <h2 className={cn("text-4xl lg:text-5xl font-light text-slate-900 mb-6 tracking-tight", titleClassName)}>
          {title}
        </h2>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-slate-400/60 to-transparent mx-auto" />
      </div>
      {subtitle && (
        <p className={cn("text-xl text-slate-700 font-light mt-8 max-w-2xl mx-auto", subtitleClassName)}>{subtitle}</p>
      )}
      {children}
    </div>
  );
}
