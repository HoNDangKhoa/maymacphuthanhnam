import { ContentListPage } from "@/components/admin/ContentListPage";
import { prisma } from "@/lib/prisma";

export default async function AdminCapabilitiesPage() {
  const posts = await prisma.post.findMany({
    where: { type: "CAPABILITY" },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <ContentListPage
      title="Năng lực sản xuất"
      typeLabel="Năng lực sản xuất"
      createHref="/admin/content/capabilities/new"
      editBasePath="/admin/content/capabilities"
      viewBasePath="/nang-luc-san-xuat"
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
