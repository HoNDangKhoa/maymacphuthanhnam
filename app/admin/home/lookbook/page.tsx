import { LookbookEditor } from "@/components/admin/HomeSectionForms";
import { resolveProductDetail } from "@/lib/home-content";
import { getSiteSettings } from "@/lib/queries";

export default async function Page() {
  const settings = await getSiteSettings();
  const lookbook = settings.homeLookbook;
  return (
    <LookbookEditor
      initial={{
        ...lookbook,
        products: lookbook.products.map(resolveProductDetail),
      }}
    />
  );
}
