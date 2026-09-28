"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export type ProductMenuItem = {
  href: string;
  label: string;
  description: string;
};

const PRODUCTS_HREF = "/san-pham";

export function Header({
  logoUrl,
  productMenu = [],
}: {
  logoUrl?: string;
  productMenu?: ProductMenuItem[];
}) {
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "border-b border-[var(--line)] bg-paper/95 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-5 md:h-[5.5rem] md:px-8">
        <Logo light={!solid} imageUrl={logoUrl} />

        <nav className="hidden items-center gap-6 lg:flex xl:gap-9">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const linkClass = cn(
              "relative inline-flex items-center gap-1 pb-1 text-base font-medium transition-colors",
              active
                ? "text-accent"
                : solid
                  ? "text-ink hover:text-accent"
                  : "text-paper hover:text-paper/90",
            );
            const underline = active && (
              <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-accent" />
            );

            if (item.href !== PRODUCTS_HREF || !productMenu.length) {
              return (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                  {underline}
                </Link>
              );
            }

            return (
              <div key={item.href} className="group/menu relative">
                <Link href={item.href} className={linkClass}>
                  {item.label}
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-300 group-focus-within/menu:rotate-180 group-hover/menu:rotate-180"
                  />
                  {underline}
                </Link>
                <div className="invisible absolute top-full left-1/2 z-10 w-[22rem] -translate-x-1/2 pt-5 opacity-0 transition duration-300 group-focus-within/menu:visible group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-paper p-2 shadow-xl">
                    {productMenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block rounded-xl px-4 py-3 transition-colors hover:bg-ink/5"
                      >
                        <span className="block text-sm font-medium text-ink">
                          {sub.label}
                        </span>
                        {sub.description ? (
                          <span className="mt-0.5 line-clamp-1 text-xs text-ink/50">
                            {sub.description}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                    <Link
                      href={PRODUCTS_HREF}
                      className="mt-1 flex items-center justify-between rounded-xl border-t border-[var(--line)] px-4 py-3 text-sm font-medium text-accent hover:bg-accent/5"
                    >
                      Xem tất cả sản phẩm
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
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
        <div className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-[var(--line)] bg-paper px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-base font-medium",
                    isActive(item.href) ? "text-accent" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
                {item.href === PRODUCTS_HREF && productMenu.length ? (
                  <div className="mt-3 flex flex-col gap-3 border-l border-[var(--line)] pl-4">
                    {productMenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="text-sm text-ink/70"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
