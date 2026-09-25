"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/actions";
import { POST_STATUS_LABEL, POST_TYPE_LABEL } from "@/lib/cms";
import { Badge } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  createdAt: string;
  category?: { name: string } | null;
};

export function PostsTable({ posts }: { posts: PostRow[] }) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto border border-[var(--line)] bg-paper">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-[var(--line)] bg-mist/50 text-xs tracking-wider uppercase">
          <tr>
            <th className="px-4 py-3 font-semibold">Tiêu đề</th>
            <th className="px-4 py-3 font-semibold">Loại</th>
            <th className="px-4 py-3 font-semibold">Danh mục</th>
            <th className="px-4 py-3 font-semibold">Trạng thái</th>
            <th className="px-4 py-3 font-semibold">Ngày</th>
            <th className="px-4 py-3 font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-[var(--line)]">
              <td className="px-4 py-3 font-medium">{post.title}</td>
              <td className="px-4 py-3 text-ink/60">
                {POST_TYPE_LABEL[post.type] || post.type}
              </td>
              <td className="px-4 py-3 text-ink/60">
                {post.category?.name || "—"}
              </td>
              <td className="px-4 py-3">
                <Badge
                  tone={post.status === "PUBLISHED" ? "success" : "default"}
                >
                  {POST_STATUS_LABEL[post.status] || post.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-ink/60">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link href={`/admin/posts/${post.id}`}>
                    <Button type="button" size="sm" variant="outline">
                      Sửa
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={async () => {
                      if (!confirm("Xoá bài viết này?")) return;
                      await deletePost(post.id);
                      router.refresh();
                    }}
                  >
                    Xoá
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
