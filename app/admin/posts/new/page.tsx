import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ type?: string }> };

export default async function NewPostRedirect({ searchParams }: Props) {
  const { type } = await searchParams;
  if (type === "CAPABILITY") redirect("/admin/content/capabilities/new");
  if (type === "SERVICE") redirect("/admin/content/services/new");
  redirect("/admin/content/news/new");
}
