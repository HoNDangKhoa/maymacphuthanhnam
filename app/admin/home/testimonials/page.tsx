import { TestimonialsEditor } from "@/components/admin/HomeSectionForms";
import { getSiteSettings } from "@/lib/queries";

export default async function Page() {
  const settings = await getSiteSettings();
  return <TestimonialsEditor initial={settings.homeTestimonials} />;
}
