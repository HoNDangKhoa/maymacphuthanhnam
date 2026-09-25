import { PostForm } from "@/components/admin/PostForm";

export default function NewServicePage() {
  return <PostForm initial={{ type: "SERVICE", status: "DRAFT" }} />;
}
