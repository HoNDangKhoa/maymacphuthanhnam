import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PillLink } from "@/components/common/PillLink";
import { ProductGallery } from "@/components/products/ProductGallery";
import { resolveProductDetail } from "@/lib/home-content";
import { getSiteSettings } from "@/lib/queries";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

async function findProduct(id: string) {
  const settings = await getSiteSettings();
  const products = settings.homeLookbook.products;
  const product = products.find((p) => p.id === decodeURIComponent(id));
  return { product, products, logoUrl: settings.logoUrl };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { product } = await findProduct(id);
  if (!product) return { title: "Không tìm thấy" };
  const detail = resolveProductDetail(product);
  return {
    title: product.name,
    description: detail.description.slice(0, 160),
  };
}

function Bracket({ children }: { children: string }) {
  return <p className="text-sm text-ink/45 md:text-base">[{children}]</p>;
}

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const { product, products, logoUrl } = await findProduct(id);
  if (!product) notFound();

  const detail = resolveProductDetail(product);
  const paragraphs = detail.description
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const related = [
    ...products.filter(
      (p) => p.id !== product.id && p.category === product.category,
    ),
    ...products.filter(
      (p) => p.id !== product.id && p.category !== product.category,
    ),
  ].slice(0, 3);

  return (
    <div className="bg-paper">
      <section className="relative overflow-hidden bg-ink pt-40 pb-16 text-paper md:pt-48 md:pb-20">
        {product.image ? (
          <Image
            src={product.image}
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
            {product.name}
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="mt-5 flex flex-wrap items-center gap-2 text-sm text-paper/60"
          >
            <Link href="/" className="hover:text-paper">
              Trang chủ
            </Link>
            <span>»</span>
            <Link href="/#san-pham" className="hover:text-paper">
              Sản phẩm
            </Link>
            <span>»</span>
            <span className="text-paper">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <Bracket>{detail.eyebrow}</Bracket>
          <h2 className="mt-4 font-display text-3xl leading-tight font-medium tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">
            {detail.detailTitle}
          </h2>
          <div className="mt-8 space-y-5 text-base leading-[1.75] text-ink/80 md:text-lg">
            {paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </div>
          <PillLink href="/lien-he" variant="dark" className="mt-10">
            Liên hệ báo giá
          </PillLink>
        </div>

        {detail.gallery.length ? (
          <div className="mx-auto mt-20 max-w-6xl px-5 md:mt-24 md:px-8">
            <div className="text-center">
              <Bracket>{detail.galleryEyebrow}</Bracket>
              <h2 className="mx-auto mt-4 max-w-4xl font-display text-3xl leading-tight font-medium tracking-tight text-ink md:text-4xl">
                {detail.galleryTitle}
              </h2>
            </div>
            <div className="mt-10 md:mt-12">
              <ProductGallery
                images={detail.gallery}
                name={product.name}
                logoUrl={logoUrl}
              />
            </div>
          </div>
        ) : null}
      </section>

      {related.length ? (
        <section className="bg-[#1a1a1a] py-20 text-white md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Sản phẩm khác
              </h2>
              <Link
                href="/#san-pham"
                className="text-sm text-white/60 hover:text-white"
              >
                Xem tất cả →
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/san-pham/${encodeURIComponent(item.id)}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#111]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <p className="mt-4 text-xs text-accent">{item.category}</p>
                  <p className="mt-1 font-display text-lg font-medium">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
