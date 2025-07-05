import { cn } from "@/lib/utils";

interface StatItem {
  value: string | number;
  label: string;
  id?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
  itemClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
  variant?: "default" | "dark";
}

export default function StatsGrid({
  stats,
  columns = 3,
  className,
  itemClassName,
  valueClassName,
  labelClassName,
  variant = "default",
}: StatsGridProps) {
  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }[columns];

  const baseItemClass =
    variant === "dark"
      ? "text-center p-6 bg-slate-900/5 backdrop-blur-sm border border-slate-300/20 rounded-sm"
      : "text-center p-6 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-sm shadow-sm";

  const baseValueClass =
    variant === "dark" ? "text-3xl font-light text-white mb-2" : "text-3xl font-light text-slate-900 mb-2";

  const baseLabelClass =
    variant === "dark"
      ? "text-sm text-white/70 font-medium tracking-wide uppercase"
      : "text-sm text-slate-600 font-medium tracking-wide uppercase";

  return (
    <div className={cn(`grid ${gridClass} gap-6`, className)}>
      {stats.map((stat, index) => (
        <div key={stat.id || index} className={cn(baseItemClass, itemClassName)}>
          <div className={cn(baseValueClass, valueClassName)}>{stat.value}</div>
          <div className={cn(baseLabelClass, labelClassName)}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
