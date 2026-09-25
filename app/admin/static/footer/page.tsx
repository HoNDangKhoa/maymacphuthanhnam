import { FooterEditor } from "@/components/admin/FooterEditor";
import { parseBannerData } from "@/lib/branding";
import { prisma } from "@/lib/prisma";

export default async function FooterPage() {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "site_config" },
  });
  const banner = parseBannerData(settings?.bannerData);

  return <FooterEditor initial={banner.footer} />;
}
