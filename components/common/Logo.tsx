import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  light = false,
  imageUrl,
}: {
  className?: string;
  light?: boolean;
  imageUrl?: string;
}) {
  if (imageUrl) {
    return (
      <Link
        href="/"
        className={cn("relative block h-12 w-[170px] md:h-16 md:w-[220px]", className)}
      >
        <Image
          src={imageUrl}
          alt="PTN Apparel"
          fill
          className="object-contain object-left"
          sizes="220px"
          priority
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col leading-none", className)}
      aria-label="PTN Apparel"
    >
      <span className="relative inline-block">
        <span
          className={cn(
            "font-display text-[1.9rem] font-bold tracking-tight md:text-[2.3rem]",
            light ? "text-[#f5d54a]" : "text-[#e8c52a]",
            "drop-shadow-[0_0_0.5px_#c8102e]",
            "[text-shadow:0_0_1px_#c8102e,0_0_1px_#c8102e]",
          )}
        >
          PTN
        </span>
        <span
          className={cn(
            "mt-0.5 block font-[cursive] text-[1.05rem] font-semibold italic leading-none md:text-[1.25rem]",
            light ? "text-[#ff6b7a]" : "text-accent",
          )}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Apparel
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-1 left-0 h-[3px] w-full rounded-full",
            light ? "bg-[#ff6b7a]" : "bg-accent",
          )}
          style={{
            clipPath: "ellipse(50% 100% at 50% 0%)",
            height: 6,
            borderRadius: "0 0 40% 40%",
            transform: "scaleY(0.55)",
          }}
        />
      </span>
    </Link>
  );
}
