import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";

export default function Page() {
  return (
    <div>
      <AdminPageHeader title="Thư viện media" />
      <AdminCard>
        <p className="text-sm font-semibold text-ink/60">
          Upload file qua API <code>/api/upload</code> (Vercel Blob trên
          production). Các ảnh đã upload nằm tại{" "}
          <code>public/uploads</code> khi chạy local.
        </p>
      </AdminCard>
    </div>
  );
}
