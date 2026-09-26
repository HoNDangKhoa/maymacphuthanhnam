import { SectionEditorPage } from "@/components/admin/SectionEditorPage";

export default function Page() {
  return (
    <SectionEditorPage
      title="Số liệu thống kê"
      description="Thanh số liệu dưới hero: năm kinh nghiệm, mã hàng, đối tác, nhân sự."
      fields={[
        { name: "years", label: "Năm kinh nghiệm", defaultValue: "11+" },
        { name: "orders", label: "Mã hàng", defaultValue: "10.000+" },
        { name: "partners", label: "Đối tác", defaultValue: "100+" },
        { name: "staff", label: "Nhân sự", defaultValue: "200+" },
      ]}
    />
  );
}
