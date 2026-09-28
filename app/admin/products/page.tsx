import { ProductList } from "@/components/admin/ProductAdmin";
import { categoryInfoOf, productHref } from "@/lib/home-content";
import { getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const catalog = (await getSiteSettings()).homeLookbook;
  return (
    <ProductList
      products={catalog.products.map((p) => ({ ...p, href: productHref(p) }))}
      categories={catalog.categories.map((key) => ({
        key,
        name: categoryInfoOf(catalog, key).name,
      }))}
    />
  );
}
