import { SectionEditorPage } from "@/components/admin/SectionEditorPage";

export default function Page() {
  return (
    <SectionEditorPage
      title="Giới thiệu"
      description="Nội dung trang /gioi-thieu và khối giới thiệu."
      fields={[
        {
          name: "title",
          label: "Tiêu đề",
          defaultValue: "May Mặc Phú Thành Nam",
        },
        {
          name: "content",
          label: "Nội dung",
          multiline: true,
          defaultValue:
            "Doanh nghiệp gia công may mặc định hướng chuẩn quốc tế.",
        },
      ]}
    />
  );
}
