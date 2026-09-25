import { redirect } from "next/navigation";

export default function LegacyInquiriesRedirect() {
  redirect("/admin/contacts");
}
