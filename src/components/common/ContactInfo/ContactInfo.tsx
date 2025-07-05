import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactInfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

interface ContactInfoProps {
  items: ContactInfoItem[];
  className?: string;
  itemClassName?: string;
  title?: string;
  titleClassName?: string;
}

export default function ContactInfo({ items, className, itemClassName, title, titleClassName }: ContactInfoProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {title && <h4 className={cn("text-sm text-slate-600 font-medium", titleClassName)}>{title}</h4>}
      <div className="space-y-3 text-sm">
        {items.map((item, index) => {
          const content = (
            <div className={cn("flex items-center gap-3 text-slate-700", itemClassName)}>
              <item.icon className="h-4 w-4 text-slate-500" />
              <span className={item.value.includes("@") ? "font-mono" : ""}>{item.value}</span>
            </div>
          );

          if (item.href) {
            return (
              <a
                key={index}
                href={item.href}
                className="block hover:text-slate-900 transition-colors"
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {content}
              </a>
            );
          }

          return <div key={index}>{content}</div>;
        })}
      </div>
    </div>
  );
}
