import { redirect } from "next/navigation";

export default function LegacyWorkflowRedirect() {
  redirect("/admin/home/workflow");
}
