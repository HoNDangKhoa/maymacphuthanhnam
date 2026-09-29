import { cn } from "@/lib/utils";

export function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-sm tracking-wide text-accent",
        className,
      )}
    >
      <span className="h-3 w-3 shrink-0 rounded-[3px] bg-accent" aria-hidden />
      {children}
    </p>
  );
}
