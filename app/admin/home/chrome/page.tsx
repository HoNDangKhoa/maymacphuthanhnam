import { HomeChromeEditor } from "@/components/admin/HomeSectionForms";
import { getSiteSettings } from "@/lib/queries";

export default async function Page() {
  const settings = await getSiteSettings();
  return <HomeChromeEditor initial={settings.homeChrome} />;
}
