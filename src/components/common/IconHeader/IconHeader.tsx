import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  iconContainerClassName?: string;
}

export default function IconHeader({
  icon: Icon,
  title,
  subtitle,
  className,
  iconClassName,
  titleClassName,
  subtitleClassName,
  iconContainerClassName,
}: IconHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-4", className)}>
      <div className={cn("p-3 bg-slate-900/10 rounded-sm", iconContainerClassName)}>
        <Icon className={cn("w-6 h-6 text-slate-700", iconClassName)} />
      </div>
      <div>
        <h3 className={cn("text-xl font-medium text-slate-900", titleClassName)}>{title}</h3>
        {subtitle && <p className={cn("text-slate-700 font-light", subtitleClassName)}>{subtitle}</p>}
      </div>
    </div>
  );
}
