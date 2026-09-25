import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditNewsPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findFirst({
    where: { id, type: "NEWS" },
    include: { category: true },
  });
  if (!post) notFound();

  return (
    <PostForm
      initial={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        contentHtml: post.contentHtml,
        thumbnail: post.thumbnail,
        type: post.type,
        status: post.status,
        categoryName: post.category?.name,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        seoKeywords: post.seoKeywords,
        canonicalUrl: post.canonicalUrl,
        tags: post.tags,
        sortOrder: post.sortOrder,
        isVisible: post.isVisible,
        isFeatured: post.isFeatured,
        isNew: post.isNew,
        publishedAt: post.publishedAt
          ? post.publishedAt.toISOString().slice(0, 10)
          : null,
      }}
    />
  );
}
