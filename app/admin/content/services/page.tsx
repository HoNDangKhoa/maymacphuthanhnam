import { ContentListPage } from "@/components/admin/ContentListPage";
import { prisma } from "@/lib/prisma";

export default async function AdminServicesPage() {
  const posts = await prisma.post.findMany({
    where: { type: "SERVICE" },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <ContentListPage
      title="Dịch vụ"
      typeLabel="Dịch vụ"
      createHref="/admin/content/services/new"
      editBasePath="/admin/content/services"
      viewBasePath="/dich-vu"
      rows={posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        thumbnail: p.thumbnail,
        categoryName: p.category?.name,
        createdAt: p.createdAt.toISOString(),
        views: p.views,
        sortOrder: p.sortOrder,
        isNew: p.isNew,
        isVisible: p.isVisible,
      }))}
    />
  );
}
