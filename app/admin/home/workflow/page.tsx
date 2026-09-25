import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { WorkflowManager } from "@/components/admin/WorkflowManager";
import { prisma } from "@/lib/prisma";

export default async function AdminHomeWorkflowPage() {
  const steps = await prisma.workflowStep.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <AdminPageHeader title="Quy trình làm việc" />
      <p className="mb-5 text-sm font-semibold text-ink/55">
        Kéo thả thứ tự — trang chủ render Sticky Stacking tương ứng.
      </p>
      <WorkflowManager initial={steps} />
    </div>
  );
}
