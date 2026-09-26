import {
  aboutSections as fallbackAbout,
  productCategories as fallbackCategories,
  products as fallbackProducts,
  stats as fallbackStats,
  testimonials as fallbackTestimonials,
  trustFeatures as fallbackTrust,
} from "@/lib/data";

export type HomeStatItem = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  caption: string;
};

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
  name: string;
  label: string;
  category: string;
  image: string;
};

export type HomeLookbookContent = {
  eyebrow: string;
  title: string;
  description: string;
  categories: string[];
  products: HomeLookbookProduct[];
};

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
  }));
}

export function defaultHomeTrust(): HomeTrustContent {
  return {
    heading: "Đối tác tin cậy của các thương hiệu thời trang toàn cầu",
    body: "Phú Thành Nam đồng hành cùng brand từ brief đến xuất xưởng — kiểm soát chất lượng, tiến độ và chi phí theo chuẩn xuất khẩu quốc tế.",
    happyUsersTitle: "Happy users 100%",
    happyUsersSubtitle: "Tỉ lệ hài lòng khách hàng",
    ctaLabel: "Tìm hiểu về PTN →",
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
      "Lưới ảnh bất đối xứng kết hợp marquee trôi — cảm nhận quy mô sản xuất Phú Thành Nam.",
    workflowEyebrow: "Quy trình làm việc",
    workflowTitle: "Từ tiếp nhận đến xuất xưởng",
    workflowDescription:
      "Cuộn để xem từng công đoạn — sticky stacking theo chuẩn vận hành PTN.",
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
