import { SectionEyebrow } from "@/components/common/SectionEyebrow";
import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  description,
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
<SectionEyebrow className="mb-5">{eyebrow}</SectionEyebrow>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl",
          light ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            light ? "text-paper/65" : "text-ink/65",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
