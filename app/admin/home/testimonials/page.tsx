import { SectionEditorPage } from "@/components/admin/SectionEditorPage";

export default function Page() {
  return (
    <SectionEditorPage
      title="Đánh giá khách hàng"
      description="Nội dung Client Stories trên trang chủ."
      fields={[
        {
          name: "eyebrow",
          label: "Eyebrow",
          defaultValue: "CLIENT STORIES",
        },
        {
          name: "heading",
          label: "Tiêu đề",
          defaultValue: "ĐÁNH GIÁ TỪ KHÁCH HÀNG",
        },
        {
          name: "tagline",
          label: "Tagline",
          defaultValue:
            "Don't just take our word for it. Hear from the brands we've helped grow.",
        },
      ]}
    />
  );
}
