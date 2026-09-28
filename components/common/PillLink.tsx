import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "light" | "dark";
type Size = "md" | "sm";

const variants: Record<Variant, { pill: string; icon: string }> = {
  light: {
    pill: "bg-white text-ink hover:bg-ink hover:text-paper",
    icon: "bg-accent text-white group-hover:bg-white group-hover:text-ink",
  },
  dark: {
    pill: "bg-ink text-paper hover:bg-accent",
    icon: "bg-accent text-white group-hover:bg-white group-hover:text-accent",
  },
};

const sizes: Record<Size, { pill: string; icon: string; arrow: number }> = {
  md: {
    pill: "gap-4 py-2 pr-7 pl-2 text-base",
    icon: "h-11 w-11 md:h-12 md:w-12",
    arrow: 18,
  },
  sm: {
    pill: "gap-3 py-1.5 pr-5 pl-1.5 text-sm",
    icon: "h-9 w-9",
    arrow: 16,
  },
};

/** Strips trailing arrows admins may type into labels ("Xem thêm →"). */
function cleanLabel(label: string) {
  return label.replace(/\s*(→|->|»)\s*$/u, "").trim();
}

export function PillLink({
  href,
  children,
  variant = "light",
  size = "md",
  className,
}: {
  href: string;
  children: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center rounded-full font-medium shadow-sm transition-colors duration-300",
        v.pill,
        s.pill,
        className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full transition-colors duration-300",
          v.icon,
          s.icon,
        )}
      >
        <ArrowRight
          size={s.arrow}
          strokeWidth={2.25}
          className="transition-transform duration-300 group-hover:-rotate-45"
          aria-hidden
        />
      </span>
      <span>{cleanLabel(children)}</span>
    </Link>
  );
}
