import { StatsEditor } from "@/components/admin/HomeSectionForms";
import { getSiteSettings } from "@/lib/queries";

export default async function Page() {
  const settings = await getSiteSettings();
  return <StatsEditor initial={settings.homeStats} />;
}
