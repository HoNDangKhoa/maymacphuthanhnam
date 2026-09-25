import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostRedirect({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) redirect("/admin/content/news");
  if (post.type === "CAPABILITY") redirect(`/admin/content/capabilities/${id}`);
  if (post.type === "SERVICE") redirect(`/admin/content/services/${id}`);
  redirect(`/admin/content/news/${id}`);
}
