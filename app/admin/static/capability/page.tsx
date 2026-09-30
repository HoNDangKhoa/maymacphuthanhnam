import { PageArticleEditor } from "@/components/admin/HomeSectionForms";
import { getSiteSettings } from "@/lib/queries";

export default async function Page() {
  const settings = await getSiteSettings();
  return <PageArticleEditor page="capability" initial={settings.capabilityArticle} />;
}
