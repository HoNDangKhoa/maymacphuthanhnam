import { PostForm } from "@/components/admin/PostForm";

export default function NewNewsPage() {
  return <PostForm initial={{ type: "NEWS", status: "DRAFT" }} />;
}
