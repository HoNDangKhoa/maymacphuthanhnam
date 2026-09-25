import { redirect } from "next/navigation";

export default function LegacyGalleryRedirect() {
  redirect("/admin/branding/gallery");
}
