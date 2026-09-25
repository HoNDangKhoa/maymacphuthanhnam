import { SectionEditorPage } from "@/components/admin/SectionEditorPage";

export default function Page() {
  return (
    <SectionEditorPage
      title="Số liệu thống kê"
      description="Thanh số liệu dưới hero: năm kinh nghiệm, đơn hàng, đối tác, nhân viên."
      fields={[
        { name: "years", label: "Năm kinh nghiệm", defaultValue: "11+" },
        { name: "orders", label: "Đơn hàng", defaultValue: "10.000+" },
        { name: "partners", label: "Đối tác", defaultValue: "100+" },
        { name: "staff", label: "Nhân viên", defaultValue: "200+" },
      ]}
    />
  );
}
