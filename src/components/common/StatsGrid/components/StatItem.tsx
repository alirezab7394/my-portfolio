import { cn } from "@/lib/utils";

interface StatItemProps {
  value: string | number;
  label: string;
  id?: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
  variant?: "default" | "dark";
}

export default function StatItem({
  value,
  label,
  className,
  valueClassName,
  labelClassName,
  variant = "default",
}: StatItemProps) {
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
    <div className={cn(baseItemClass, className)}>
      <div className={cn(baseValueClass, valueClassName)}>{value}</div>
      <div className={cn(baseLabelClass, labelClassName)}>{label}</div>
    </div>
  );
}
