import {
  aboutSections as fallbackAbout,
  productCategories as fallbackCategories,
  productCategoryInfo as fallbackCategoryInfo,
  products as fallbackProducts,
  stats as fallbackStats,
  testimonials as fallbackTestimonials,
  trustFeatures as fallbackTrust,
} from "@/lib/data";
import { slugify } from "@/lib/cms";

export { slugify };

export const STAT_ICON_OPTIONS = [
  { key: "award", label: "Huy chương / Kinh nghiệm" },
  { key: "package", label: "Hộp / Mã hàng" },
  { key: "handshake", label: "Bắt tay / Đối tác" },
  { key: "users", label: "Nhóm người / Nhân sự" },
  { key: "factory", label: "Nhà xưởng" },
  { key: "shirt", label: "Áo / Sản phẩm" },
  { key: "scissors", label: "Kéo / Cắt may" },
  { key: "truck", label: "Xe tải / Giao hàng" },
  { key: "globe", label: "Quả địa cầu / Xuất khẩu" },
  { key: "star", label: "Ngôi sao / Chất lượng" },
  { key: "clock", label: "Đồng hồ / Tiến độ" },
  { key: "shield", label: "Khiên / Uy tín" },
] as const;

export type StatIconKey = (typeof STAT_ICON_OPTIONS)[number]["key"];

const DEFAULT_STAT_ICONS: StatIconKey[] = [
  "award",
  "package",
  "handshake",
  "users",
];

export type HomeStatItem = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  caption: string;
  icon?: StatIconKey;
  iconUrl?: string;
};

export function defaultStatIcon(index: number): StatIconKey {
  return DEFAULT_STAT_ICONS[index % DEFAULT_STAT_ICONS.length]!;
}

export type HomeTrustFeature = {
  id: string;
  title: string;
  description: string;
};

export type HomeTrustContent = {
  heading: string;
  body: string;
  happyUsersTitle: string;
  happyUsersSubtitle: string;
  ctaLabel: string;
  ctaHref: string;
  features: HomeTrustFeature[];
};

export type HomeTestimonialItem = {
  id: string;
  quote: string;
  author: string;
  role: string;
  initials: string;
  avatarTone: "ink" | "accent";
};

export type HomeTestimonialsContent = {
  eyebrow: string;
  heading: string;
  tagline: string;
  items: HomeTestimonialItem[];
};

export type HomeLookbookProduct = {
  id: string;
  slug?: string;
  isVisible?: boolean;
  name: string;
  label: string;
  category: string;
  image: string;
  eyebrow?: string;
  detailTitle?: string;
  description?: string;
  galleryEyebrow?: string;
  galleryTitle?: string;
  gallery?: string[];
};

export type LookbookProductDetail = HomeLookbookProduct & {
  eyebrow: string;
  detailTitle: string;
  description: string;
  galleryEyebrow: string;
  galleryTitle: string;
  gallery: string[];
};

export function resolveProductDetail(
  product: HomeLookbookProduct,
): LookbookProductDetail {
  const fallback = fallbackProducts.find(
    (p) => p.id === product.id || p.category === product.category,
  );
  const gallery = (product.gallery ?? []).filter(Boolean);
  return {
    ...product,
    eyebrow: product.eyebrow?.trim() || "Thiết kế để truyền cảm hứng",
    galleryEyebrow: product.galleryEyebrow?.trim() || "Từ ý tưởng đến thành phẩm",
    galleryTitle:
      product.galleryTitle?.trim() ||
      "Khám phá sự kết hợp giữa sáng tạo và công nghệ ở từng công đoạn",
    detailTitle:
      product.detailTitle?.trim() ||
      fallback?.detailTitle ||
      `${product.name} — chuẩn xuất khẩu`,
    description:
      product.description?.trim() ||
      fallback?.description ||
      `${product.name} được Phú Thành Nam phát triển mẫu và sản xuất theo tiêu chuẩn xuất khẩu, kiểm soát chất lượng AQL trên từng lô hàng.`,
    gallery: gallery.length
      ? gallery
      : fallback?.id === product.id && fallback.gallery.length
        ? fallback.gallery
        : [product.image].filter(Boolean),
  };
}

export type ProductCategoryInfo = {
  name: string;
  description: string;
  image: string;
};

export type HomeLookbookContent = {
  eyebrow: string;
  title: string;
  description: string;
  categories: string[];
  categoryInfo?: Record<string, ProductCategoryInfo>;
  products: HomeLookbookProduct[];
};

export function visibleProducts<T extends HomeLookbookProduct>(products: T[]) {
  return products.filter((p) => p.isVisible !== false);
}

export function productSlug(product: HomeLookbookProduct) {
  return product.slug?.trim() || slugify(product.name) || product.id;
}

export function productHref(product: HomeLookbookProduct) {
  return `/san-pham/${encodeURIComponent(productSlug(product))}`;
}

export function findProductByParam(
  products: HomeLookbookProduct[],
  param: string,
) {
  const key = decodeURIComponent(param);
  return (
    products.find((p) => productSlug(p) === key) ??
    products.find((p) => p.id === key)
  );
}

export function categorySlug(key: string) {
  return slugify(key);
}

export function categoryHref(key: string) {
  return `/san-pham?danh-muc=${categorySlug(key)}`;
}

export function categoryInfoOf(
  content: Pick<HomeLookbookContent, "categoryInfo">,
  key: string,
): ProductCategoryInfo {
  const info = content.categoryInfo?.[key];
  const fallback = fallbackCategoryInfo[key];
  return {
    name: info?.name?.trim() || fallback?.name || key,
    description: info?.description?.trim() || fallback?.description || "",
    image: info?.image?.trim() || fallback?.image || "",
  };
}

export type HomeSectionChrome = {
  servicesEyebrow: string;
  servicesTitle: string;
  galleryEyebrow: string;
  galleryTitle: string;
  galleryDescription: string;
  workflowEyebrow: string;
  workflowTitle: string;
  workflowDescription: string;
  requestTitle: string;
  requestDescription: string;
};

export type AboutSectionItem = {
  id: string;
  title: string;
  content: string;
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export function defaultHomeStats(): HomeStatItem[] {
  return fallbackStats.map((s, i) => ({
    id: `stat_${i + 1}`,
    value: s.value,
    suffix: s.suffix,
    label: s.label,
    caption: s.caption,
    icon: defaultStatIcon(i),
    iconUrl: "",
  }));
}

export function defaultHomeTrust(): HomeTrustContent {
  return {
    heading: "Đối tác tin cậy của các thương hiệu thời trang toàn cầu",
    body: "Phú Thành Nam đồng hành cùng brand từ brief đến xuất xưởng — kiểm soát chất lượng, tiến độ và chi phí theo chuẩn xuất khẩu quốc tế.",
    happyUsersTitle: "Happy users 100%",
    happyUsersSubtitle: "Tỉ lệ hài lòng khách hàng",
    ctaLabel: "Tìm hiểu về PTN",
    ctaHref: "/gioi-thieu",
    features: fallbackTrust.map((f, i) => ({
      id: `trust_${i + 1}`,
      title: f.title,
      description: f.description,
    })),
  };
}

export function defaultHomeTestimonials(): HomeTestimonialsContent {
  return {
    eyebrow: "Client Stories",
    heading: "Đánh giá từ khách hàng",
    tagline:
      "Don't just take our word for it. Hear from the brands we've helped grow.",
    items: fallbackTestimonials.map((t, i) => ({
      id: `tm_${i + 1}`,
      quote: t.quote,
      author: t.author,
      role: t.role,
      initials: t.initials,
      avatarTone: t.avatarTone,
    })),
  };
}

export function defaultHomeLookbook(): HomeLookbookContent {
  return {
    eyebrow: "Sản phẩm của chúng tôi",
    title: "Các dòng sản phẩm đang gia công",
    description:
      "Sản phẩm chính của chúng tôi là áo blazer, áo jacket, áo khoác và quần dành cho các thương hiệu thời trang toàn cầu.",
    categories: [...fallbackCategories],
    categoryInfo: structuredClone(fallbackCategoryInfo),
    products: fallbackProducts.map((p) => ({ ...p })),
  };
}

export function defaultHomeSectionChrome(): HomeSectionChrome {
  return {
    servicesEyebrow: "Dịch vụ",
    servicesTitle: "Dịch vụ của chúng tôi",
    galleryEyebrow: "Không gian sản xuất",
    galleryTitle: "Không gian xưởng & máy móc",
    galleryDescription:
      "Hệ thống nhà xưởng, dây chuyền và máy móc hiện đại — quy mô sản xuất của Phú Thành Nam.",
    workflowEyebrow: "Quy trình làm việc",
    workflowTitle: "Từ tiếp nhận đến xuất xưởng",
    workflowDescription:
      "Quy trình 5 bước được chuẩn hóa, minh bạch tiến độ và chất lượng cho từng đơn hàng.",
    requestTitle: "Gửi yêu cầu cho chúng tôi",
    requestDescription:
      "Để lại thông tin — đội ngũ Phú Thành Nam sẽ liên hệ tư vấn OMD/CMT trong 24 giờ làm việc.",
  };
}

export function defaultAboutSections(): AboutSectionItem[] {
  return fallbackAbout.map((s) => ({ ...s }));
}

export function newHomeStat(partial?: Partial<HomeStatItem>): HomeStatItem {
  return {
    id: uid("stat"),
    value: 0,
    suffix: "+",
    label: "",
    caption: "",
    icon: "award",
    iconUrl: "",
    ...partial,
  };
}

export function newTrustFeature(
  partial?: Partial<HomeTrustFeature>,
): HomeTrustFeature {
  return {
    id: uid("trust"),
    title: "",
    description: "",
    ...partial,
  };
}

export function newTestimonial(
  partial?: Partial<HomeTestimonialItem>,
): HomeTestimonialItem {
  return {
    id: uid("tm"),
    quote: "",
    author: "",
    role: "",
    initials: "",
    avatarTone: "ink",
    ...partial,
  };
}

export function newLookbookProduct(
  partial?: Partial<HomeLookbookProduct>,
): HomeLookbookProduct {
  return {
    id: uid("prod"),
    name: "",
    label: "",
    category: "BLAZER",
    image: "",
    eyebrow: "",
    detailTitle: "",
    description: "",
    galleryEyebrow: "",
    galleryTitle: "",
    gallery: [],
    ...partial,
  };
}

export function newAboutSection(
  partial?: Partial<AboutSectionItem>,
): AboutSectionItem {
  return {
    id: uid("about"),
    title: "",
    content: "",
    ...partial,
  };
}
