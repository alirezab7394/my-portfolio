import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "solid";
  hover?: boolean;
}

export default function InfoCard({ children, className, variant = "default", hover = true }: InfoCardProps) {
  const baseClass = "rounded-sm p-6 transition-all duration-300";

  const variantClass = {
    default: "bg-slate-900/5 backdrop-blur-sm border border-slate-300/20",
    glass: "bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm",
    solid: "bg-white border border-slate-200 shadow-sm",
  }[variant];

  const hoverClass = hover ? "hover:bg-slate-900/10 hover:shadow-md" : "";

  return <div className={cn(baseClass, variantClass, hoverClass, className)}>{children}</div>;
}
