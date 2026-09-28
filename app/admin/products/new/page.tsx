import { ProductForm } from "@/components/admin/ProductAdmin";
import { categoryInfoOf, newLookbookProduct } from "@/lib/home-content";
import { getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const catalog = (await getSiteSettings()).homeLookbook;
  return (
    <ProductForm
      isNew
      initial={newLookbookProduct({ category: catalog.categories[0] ?? "" })}
      categories={catalog.categories.map((key) => ({
        key,
        name: categoryInfoOf(catalog, key).name,
      }))}
    />
  );
}
