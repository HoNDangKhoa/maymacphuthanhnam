import { ContentListPage } from "@/components/admin/ContentListPage";
import { prisma } from "@/lib/prisma";

export default async function AdminNewsPage() {
  const posts = await prisma.post.findMany({
    where: { type: "NEWS" },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <ContentListPage
      title="Tin tức"
      typeLabel="Tin tức"
      createHref="/admin/content/news/new"
      editBasePath="/admin/content/news"
      viewBasePath="/tin-tuc"
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
