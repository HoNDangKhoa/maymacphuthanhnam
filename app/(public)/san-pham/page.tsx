import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import {
  visibleProducts,
  categoryHref,
  categoryInfoOf,
  categorySlug,
} from "@/lib/home-content";
import { getSiteSettings } from "@/lib/queries";
import { cn } from "@/lib/utils";

type Props = { searchParams: Promise<{ "danh-muc"?: string }> };

export const dynamic = "force-dynamic";

async function load(searchParams: Props["searchParams"]) {
  const settings = await getSiteSettings();
  const catalog = {
    ...settings.homeLookbook,
    products: visibleProducts(settings.homeLookbook.products),
  };
  const { "danh-muc": slug } = await searchParams;
  const activeKey = slug
    ? catalog.categories.find((c) => categorySlug(c) === slug)
    : undefined;
  return { catalog, activeKey };
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { catalog, activeKey } = await load(searchParams);
  if (activeKey) {
    const info = categoryInfoOf(catalog, activeKey);
    return {
      title: info.name,
      description: info.description || catalog.description,
    };
  }
  return { title: "Sản phẩm", description: catalog.description };
}

export default async function ProductsPage({ searchParams }: Props) {
  const { catalog, activeKey } = await load(searchParams);
  const activeInfo = activeKey ? categoryInfoOf(catalog, activeKey) : null;
  const products = activeKey
    ? catalog.products.filter((p) => p.category === activeKey)
    : catalog.products;
  const heroImage = activeInfo?.image || catalog.products[0]?.image || "";

  return (
    <div className="bg-paper">
      <section className="relative overflow-hidden bg-ink pt-40 pb-16 text-paper md:pt-48 md:pb-20">
        {heroImage ? (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            {activeInfo?.name ?? "Sản phẩm"}
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="mt-5 flex flex-wrap items-center gap-2 text-sm text-paper/60"
          >
            <Link href="/" className="hover:text-paper">
              Trang chủ
            </Link>
            <span>»</span>
            {activeInfo ? (
              <>
                <Link href="/san-pham" className="hover:text-paper">
                  Sản phẩm
                </Link>
                <span>»</span>
                <span className="text-paper">{activeInfo.name}</span>
              </>
            ) : (
              <span className="text-paper">Sản phẩm</span>
            )}
          </nav>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm text-ink/45 md:text-base">
              [{activeInfo ? "Danh mục sản phẩm" : catalog.eyebrow}]
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-medium tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">
              {activeInfo?.name ?? catalog.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink/65 md:text-lg">
              {activeInfo?.description || catalog.description}
            </p>
          </div>

          <nav
            aria-label="Danh mục sản phẩm"
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {[
              { key: "", label: "Tất cả", href: "/san-pham", count: catalog.products.length },
              ...catalog.categories.map((c) => ({
                key: c,
                label: categoryInfoOf(catalog, c).name,
                href: categoryHref(c),
                count: catalog.products.filter((p) => p.category === c).length,
              })),
            ].map((chip) => {
              const selected = (activeKey ?? "") === chip.key;
              return (
                <Link
                  key={chip.key || "all"}
                  href={chip.href}
                  scroll={false}
                  aria-current={selected ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition duration-300",
                    selected
                      ? "border-accent bg-accent text-white"
                      : "border-[var(--line)] bg-white text-ink hover:border-ink/30",
                  )}
                >
                  {chip.label}
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      selected ? "text-white/70" : "text-ink/40",
                    )}
                  >
                    {chip.count}
                  </span>
                </Link>
              );
            })}
          </nav>

          {products.length ? (
            <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={categoryInfoOf(catalog, product.category).name}
                />
              ))}
            </div>
          ) : (
            <p className="mt-16 text-center text-ink/50">
              Chưa có sản phẩm trong danh mục này.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
