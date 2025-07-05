import { cn } from "@/lib/utils";

interface TechTagsProps {
  tags: string[];
  title?: string;
  className?: string;
  tagClassName?: string;
  titleClassName?: string;
  variant?: "default" | "rounded" | "outlined";
}

export default function TechTags({
  tags,
  title,
  className,
  tagClassName,
  titleClassName,
  variant = "default",
}: TechTagsProps) {
  const baseTagClass = "px-3 py-1 text-xs font-medium transition-colors";

  const variantClass = {
    default: "bg-slate-900/10 text-slate-700 rounded-full",
    rounded: "bg-slate-100 text-slate-700 rounded-full",
    outlined: "border border-slate-200 text-slate-700 rounded-sm bg-white/80 backdrop-blur-sm hover:bg-slate-50",
  }[variant];

  return (
    <div className={cn("mb-6", className)}>
      {title && (
        <h4 className={cn("text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider", titleClassName)}>
          {title}
        </h4>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className={cn(baseTagClass, variantClass, tagClassName)}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
