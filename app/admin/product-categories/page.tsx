import { ProductCategoriesEditor } from "@/components/admin/ProductAdmin";
import { categoryInfoOf } from "@/lib/home-content";
import { getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProductCategoriesPage() {
  const catalog = (await getSiteSettings()).homeLookbook;
  return (
    <ProductCategoriesEditor
      initial={catalog.categories.map((key) => ({
        key,
        ...categoryInfoOf(catalog, key),
        count: catalog.products.filter((p) => p.category === key).length,
      }))}
    />
  );
}
