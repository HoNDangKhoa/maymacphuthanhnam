import { AdminCard, AdminPageHeader, ContentToolbar } from "@/components/admin/AdminChrome";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title="Danh mục" />
      <ContentToolbar createHref="/admin/categories" createLabel="Thêm danh mục" />
      <AdminCard title="Danh sách danh mục">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#f3f4f6] text-xs font-semibold text-ink/60 uppercase">
              <tr>
                <th className="px-3 py-3">STT</th>
                <th className="px-3 py-3">Tên</th>
                <th className="px-3 py-3">Slug</th>
                <th className="px-3 py-3">Loại</th>
                <th className="px-3 py-3">Số bài</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.id} className="border-t border-black/5">
                  <td className="px-3 py-3 font-semibold">{i + 1}</td>
                  <td className="px-3 py-3 font-semibold">{cat.name}</td>
                  <td className="px-3 py-3 text-ink/50">/{cat.slug}</td>
                  <td className="px-3 py-3">{cat.type}</td>
                  <td className="px-3 py-3">{cat._count.posts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
