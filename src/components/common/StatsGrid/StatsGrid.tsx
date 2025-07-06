import { cn } from "@/lib/utils";
import { StatItem } from "./components";

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
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  }[columns];

  return (
    <div className={cn(`grid ${gridClass} gap-6`, className)}>
      {stats.map((stat, index) => (
        <StatItem
          key={stat.id || index}
          value={stat.value}
          label={stat.label}
          className={itemClassName}
          valueClassName={valueClassName}
          labelClassName={labelClassName}
          variant={variant}
        />
      ))}
    </div>
  );
}
