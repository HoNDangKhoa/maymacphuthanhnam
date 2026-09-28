import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductAdmin";
import {
  categoryInfoOf,
  productHref,
  productSlug,
  resolveProductDetail,
} from "@/lib/home-content";
import { getSiteSettings } from "@/lib/queries";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const catalog = (await getSiteSettings()).homeLookbook;
  const product = catalog.products.find((p) => p.id === decodeURIComponent(id));
  if (!product) notFound();

  return (
    <ProductForm
      key={product.id}
      isNew={false}
      initial={{ ...resolveProductDetail(product), slug: productSlug(product) }}
      viewHref={productHref(product)}
      categories={catalog.categories.map((key) => ({
        key,
        name: categoryInfoOf(catalog, key).name,
      }))}
    />
  );
}
