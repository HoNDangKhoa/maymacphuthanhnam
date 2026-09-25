import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { prisma } from "@/lib/prisma";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <AdminPageHeader title="Gallery xưởng" />
      <p className="mb-5 text-sm font-semibold text-ink/55">
        Kho ảnh xưởng — bật/tắt Marquee, kéo thả thứ tự.
      </p>
      <GalleryManager initial={items} />
    </div>
  );
}
