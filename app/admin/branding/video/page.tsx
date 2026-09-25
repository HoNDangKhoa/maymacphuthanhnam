import { BrandAssetForm } from "@/components/admin/BrandAssetForm";
import { parseBannerData } from "@/lib/branding";
import { prisma } from "@/lib/prisma";

export default async function VideoPage() {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "site_config" },
  });
  const banner = parseBannerData(settings?.bannerData);

  return (
    <BrandAssetForm
      kind="video"
      title="Chi tiết Video mp4"
      initialUrl={banner.video.url}
      initialVisible={banner.video.visible}
      sizeHint="Upload URL video mp4 / webm (hoặc dán link CDN)"
    />
  );
}
