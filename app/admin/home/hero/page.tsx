import { HeroContentForm } from "@/components/admin/HeroContentForm";
import { parseBannerData } from "@/lib/branding";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "site_config" },
  });
  const banner = parseBannerData(settings?.bannerData);

  return <HeroContentForm initial={banner.hero} />;
}
