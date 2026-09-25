import Link from "next/link";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function SectionEditorPage({
  title,
  description,
  fields,
}: {
  title: string;
  description: string;
  fields: { name: string; label: string; defaultValue?: string; multiline?: boolean }[];
}) {
  return (
    <div>
      <AdminPageHeader title={title} />
      <p className="mb-5 text-sm font-semibold text-ink/55">{description}</p>
      <AdminCard>
        <form className="max-w-2xl space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <Label htmlFor={f.name}>{f.label}</Label>
              {f.multiline ? (
                <Textarea
                  id={f.name}
                  name={f.name}
                  rows={5}
                  defaultValue={f.defaultValue || ""}
                />
              ) : (
                <Input
                  id={f.name}
                  name={f.name}
                  defaultValue={f.defaultValue || ""}
                />
              )}
            </div>
          ))}
          <div className="flex gap-3">
            <Button type="button" className="bg-[#f59e0b] hover:bg-[#d97706]">
              Lưu thay đổi
            </Button>
            <Link href="/admin">
              <Button type="button" variant="outline">
                Quay lại
              </Button>
            </Link>
          </div>
          <p className="text-xs font-semibold text-ink/40">
            Nội dung section này đồng bộ SiteSetting / seed data. Kết nối lưu DB
            đầy đủ có thể mở rộng tiếp.
          </p>
        </form>
      </AdminCard>
    </div>
  );
}
