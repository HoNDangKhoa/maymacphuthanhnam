import { PostForm } from "@/components/admin/PostForm";

export default function NewCapabilityPage() {
  return <PostForm initial={{ type: "CAPABILITY", status: "DRAFT" }} />;
}
