import { cn } from "@/lib/utils";

interface AchievementListProps {
  items: string[];
  title?: string;
  className?: string;
  itemClassName?: string;
  titleClassName?: string;
}

export default function AchievementList({
  items,
  title,
  className,
  itemClassName,
  titleClassName,
}: AchievementListProps) {
  return (
    <div className={cn("mb-6", className)}>
      {title && (
        <h4 className={cn("text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider", titleClassName)}>
          {title}
        </h4>
      )}
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className={cn("flex items-start gap-2 text-slate-700 text-sm", itemClassName)}>
            <div className="w-1 h-1 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
            <span className="font-light">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
