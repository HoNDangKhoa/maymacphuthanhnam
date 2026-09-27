import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { InquiriesTable } from "@/components/admin/InquiriesTable";
import { prisma } from "@/lib/prisma";

export default async function AdminContactsPage() {
  const rows = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title="Thư liên hệ" />
      <p className="mb-5 text-sm text-ink/55">
        Lead CRM · Techpack · lọc ngày · xuất CSV
      </p>
      <InquiriesTable
        initial={rows.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
