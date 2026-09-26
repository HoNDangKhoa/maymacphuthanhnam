import { AboutEditor } from "@/components/admin/HomeSectionForms";
import { getSiteSettings } from "@/lib/queries";

export default async function Page() {
  const settings = await getSiteSettings();
  return <AboutEditor initial={settings.aboutSections} />;
}
