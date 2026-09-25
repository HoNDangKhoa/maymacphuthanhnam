import { auth } from "@/auth";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { Input, Label } from "@/components/ui/input";

export default async function AccountPage() {
  const session = await auth();

  return (
    <div>
      <AdminPageHeader title="Tài khoản" />
      <AdminCard>
        <div className="max-w-lg space-y-4">
          <div>
            <Label>Họ tên</Label>
            <Input defaultValue={session?.user?.name || ""} readOnly />
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue={session?.user?.email || ""} readOnly />
          </div>
          <div>
            <Label>Vai trò</Label>
            <Input defaultValue={session?.user?.role || "ADMIN"} readOnly />
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
