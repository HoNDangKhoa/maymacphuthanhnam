export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const INQUIRY_STATUS_LABEL: Record<string, string> = {
  NEW: "Mới",
  CONTACTED: "Đã gọi điện",
  PROCESSING: "Đang làm mẫu",
  COMPLETED: "Thành công",
  CANCELLED: "Huỷ",
};

export const POST_TYPE_LABEL: Record<string, string> = {
  NEWS: "Tin tức",
  CAPABILITY: "Năng lực sản xuất",
  SERVICE: "Dịch vụ",
  ABOUT_SECTION: "Giới thiệu",
};

export const POST_STATUS_LABEL: Record<string, string> = {
  DRAFT: "draft",
  REVIEW: "review",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

export const POST_TYPE_DEFAULT_CATEGORY: Record<string, string> = {
  NEWS: "Tin tức",
  CAPABILITY: "Năng lực sản xuất",
  SERVICE: "Dịch vụ",
};

export const POST_TYPE_LIST_PATH: Record<string, string> = {
  NEWS: "/admin/content/news",
  CAPABILITY: "/admin/content/capabilities",
  SERVICE: "/admin/content/services",
};

export const POST_TYPE_VIEW_PATH: Record<string, string> = {
  NEWS: "/tin-tuc",
  CAPABILITY: "/nang-luc-san-xuat",
  SERVICE: "/dich-vu",
};
