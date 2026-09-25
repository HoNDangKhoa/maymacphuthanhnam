"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Header({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const solid = scrolled || !isHome || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "border-b border-[var(--line)] bg-paper/95 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 md:h-[4.5rem] md:px-8">
        <Logo light={!solid} imageUrl={logoUrl} />

        <nav className="hidden items-center gap-7 xl:gap-9 lg:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative pb-1 text-[0.72rem] font-bold tracking-[0.12em] uppercase transition-colors md:text-[0.78rem]",
                  active
                    ? solid
                      ? "text-accent"
                      : "text-accent"
                    : solid
                      ? "text-ink hover:text-accent"
                      : "text-paper hover:text-paper/90",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className={cn("lg:hidden", solid ? "text-ink" : "text-paper")}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--line)] bg-paper px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-bold tracking-[0.12em] uppercase",
                    active ? "text-accent" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
