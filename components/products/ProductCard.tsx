import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productHref, type HomeLookbookProduct } from "@/lib/home-content";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  categoryName,
  dark = false,
}: {
  product: HomeLookbookProduct;
  categoryName: string;
  dark?: boolean;
}) {
  return (
    <Link href={productHref(product)} className="group block">
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-2xl",
          dark ? "bg-[#111]" : "bg-mist",
        )}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <p className="mt-4 text-xs text-accent">{categoryName}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p
          className={cn(
            "font-display text-lg font-medium md:text-xl",
            dark ? "text-white" : "text-ink",
          )}
        >
          {product.name}
        </p>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition duration-300 group-hover:bg-accent group-hover:text-white",
            dark ? "bg-white/10 text-white" : "bg-ink/5 text-ink",
          )}
        >
          <ArrowRight
            size={16}
            className="transition duration-300 group-hover:-rotate-45"
          />
        </span>
      </div>
    </Link>
  );
}
