import { SectionEditorPage } from "@/components/admin/SectionEditorPage";

export default function Page() {
  return (
    <SectionEditorPage
      title="Giá trị cốt lõi"
      description="Khối Đối tác tin cậy / Happy users trên trang chủ."
      fields={[
        {
          name: "heading",
          label: "Tiêu đề",
          defaultValue:
            "Đối tác tin cậy của các thương hiệu thời trang toàn cầu",
        },
        {
          name: "happyUsers",
          label: "Happy users",
          defaultValue: "Happy users 100%",
        },
      ]}
    />
  );
}
