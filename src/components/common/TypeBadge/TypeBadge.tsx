import { cn } from "@/lib/utils";

interface TypeBadgeProps {
  type: string;
  label: string;
  className?: string;
  variant?: "default" | "colorful";
}

const colorfulVariants: Record<string, string> = {
  current: "bg-green-500/20 text-green-700",
  leadership: "bg-blue-500/20 text-blue-700",
  contract: "bg-purple-500/20 text-purple-700",
  enterprise: "bg-blue-500/20 text-blue-700",
  platform: "bg-green-500/20 text-green-700",
  tool: "bg-purple-500/20 text-purple-700",
  portfolio: "bg-yellow-500/20 text-yellow-700",
  masters: "bg-primary/20 text-primary",
  bachelors: "bg-slate-200 text-slate-700",
  fulltime: "bg-slate-500/20 text-slate-700",
  junior: "bg-slate-500/20 text-slate-700",
  fullstack: "bg-slate-500/20 text-slate-700",
};

export default function TypeBadge({ type, label, className, variant = "default" }: TypeBadgeProps) {
  const baseClass = "px-3 py-1 rounded-full text-xs font-medium";

  const variantClass =
    variant === "colorful" ? colorfulVariants[type] || "bg-slate-500/20 text-slate-700" : "bg-slate-100 text-slate-700";

  return <div className={cn(baseClass, variantClass, className)}>{label}</div>;
}
