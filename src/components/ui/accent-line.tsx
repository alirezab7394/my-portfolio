import { cn } from "@/lib/utils";

interface AccentLineProps {
  /** Width of the line - can be Tailwind width classes like 'w-16', 'w-24', etc. */
  width?: string;
  /** Color variant - 'primary' for orange, 'muted' for gray */
  variant?: "primary" | "muted";
  /** Bottom margin - Tailwind margin classes like 'mb-12', 'mb-8', etc. */
  marginBottom?: string;
  /** Top margin - Tailwind margin classes like 'mt-12', 'mt-8', etc. */
  marginTop?: string;
  /** Additional CSS classes */
  className?: string;
}

export function AccentLine({
  width = "w-16",
  variant = "primary",
  marginBottom = "",
  marginTop = "",
  className,
}: AccentLineProps) {
  const gradientClasses = {
    primary: "bg-gradient-to-r from-transparent via-orange-600 to-transparent",
    muted: "bg-gradient-to-r from-transparent via-gray-300 to-transparent",
  };

  return (
    <div className="inline-block">
      <div className={cn("h-px", width, gradientClasses[variant], marginBottom, marginTop, className)} />
    </div>
  );
}
