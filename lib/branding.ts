import {
  type AboutArticle,
  type AboutSectionItem,
  aboutArticleFromSections,
  defaultAboutArticle,
  defaultCapabilityArticle,
  type HomeLookbookContent,
  type HomeSectionChrome,
  type HomeStatItem,
  type HomeTestimonialsContent,
  type HomeTrustContent,
  defaultAboutSections,
  defaultHomeLookbook,
  defaultHomeSectionChrome,
  defaultHomeStats,
  defaultHomeTestimonials,
  defaultHomeTrust,
} from "@/lib/home-content";

export type BrandAsset = {
  url: string;
  visible: boolean;
};

export type MediaListItem = {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
  sortOrder: number;
  isVisible: boolean;
};

export type FooterContent = {
  summary: string;
  content: string;
  imageUrl: string;
  copyright: string;
  isVisible: boolean;
};

export type PageSeo = {
  title: string;
  keywords: string;
  description: string;
  focusKeyword: string;
  ogImage: string;
  indexable: boolean;
  canonical: string;
  ogSiteName: string;
  ogType: string;
  ogUrl: string;
};

export type HeroContent = {
  heading: string;
  subheading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export type BannerData = {
  logo: BrandAsset;
  favicon: BrandAsset;
  video: BrandAsset;
  slideshow: MediaListItem[];
  socialFooter: MediaListItem[];
  footer: FooterContent;
  pageSeo: Record<string, PageSeo>;
  hero: HeroContent;
  homeStats: HomeStatItem[];
  homeTrust: HomeTrustContent;
  homeTestimonials: HomeTestimonialsContent;
  homeLookbook: HomeLookbookContent;
  homeChrome: HomeSectionChrome;
  aboutSections: AboutSectionItem[];
  aboutArticle: AboutArticle;
  capabilityArticle: AboutArticle;
};

export const PAGE_SEO_KEYS = [
  { key: "news", label: "Tin tức", href: "/admin/seo/news", path: "/tin-tuc" },
  {
    key: "capability",
    label: "Năng lực sản xuất",
    href: "/admin/seo/capability",
    path: "/nang-luc-san-xuat",
  },
  {
    key: "service",
    label: "Dịch vụ",
    href: "/admin/seo/service",
    path: "/dich-vu",
  },
] as const;

export function emptyPageSeo(): PageSeo {
  return {
    title: "",
    keywords: "",
    description: "",
    focusKeyword: "",
    ogImage: "",
    indexable: true,
    canonical: "",
    ogSiteName: "",
    ogType: "website",
    ogUrl: "",
  };
}

export function defaultHeroContent(): HeroContent {
  return {
    heading: "MAY MẶC PHÚ THÀNH NAM",
    subheading: "Chính xác - Quy mô - Chất lượng",
    description:
      "Đối tác gia công may mặc tin cậy cho thương hiệu trong nước và quốc tế — từ phòng mẫu đến xuất xưởng với tiêu chuẩn xuất khẩu.",
    ctaLabel: "Xem thêm",
    ctaHref: "/gioi-thieu",
  };
}

export function defaultBannerData(): BannerData {
  return {
    logo: { url: "", visible: true },
    favicon: { url: "/favicon.ico", visible: true },
    video: { url: "", visible: true },
    slideshow: [],
    socialFooter: [],
    footer: {
      summary:
        "Đối tác gia công may mặc OEM/ODM & CMT cho thương hiệu trong nước và xuất khẩu.",
      content: "",
      imageUrl: "",
      copyright: "© Phú Thành Nam. Bảo lưu mọi quyền.",
      isVisible: true,
    },
    pageSeo: {
      news: emptyPageSeo(),
      capability: emptyPageSeo(),
      service: emptyPageSeo(),
    },
    hero: defaultHeroContent(),
    homeStats: defaultHomeStats(),
    homeTrust: defaultHomeTrust(),
    homeTestimonials: defaultHomeTestimonials(),
    homeLookbook: defaultHomeLookbook(),
    homeChrome: defaultHomeSectionChrome(),
    aboutSections: defaultAboutSections(),
    aboutArticle: defaultAboutArticle(),
    capabilityArticle: defaultCapabilityArticle(),
  };
}

export function parseBannerData(raw?: string | null): BannerData {
  const base = defaultBannerData();
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<BannerData>;
    return {
      logo: { ...base.logo, ...(parsed.logo || {}) },
      favicon: { ...base.favicon, ...(parsed.favicon || {}) },
      video: { ...base.video, ...(parsed.video || {}) },
      slideshow: Array.isArray(parsed.slideshow) ? parsed.slideshow : [],
      socialFooter: Array.isArray(parsed.socialFooter)
        ? parsed.socialFooter
        : [],
      footer: { ...base.footer, ...(parsed.footer || {}) },
      pageSeo: {
        news: { ...base.pageSeo.news, ...(parsed.pageSeo?.news || {}) },
        capability: {
          ...base.pageSeo.capability,
          ...(parsed.pageSeo?.capability || {}),
        },
        service: {
          ...base.pageSeo.service,
          ...(parsed.pageSeo?.service || {}),
        },
      },
      hero: { ...base.hero, ...(parsed.hero || {}) },
      homeStats:
        Array.isArray(parsed.homeStats) && parsed.homeStats.length
          ? parsed.homeStats
          : base.homeStats,
      homeTrust: {
        ...base.homeTrust,
        ...(parsed.homeTrust || {}),
        features:
          Array.isArray(parsed.homeTrust?.features) &&
          parsed.homeTrust.features.length
            ? parsed.homeTrust.features
            : base.homeTrust.features,
      },
      homeTestimonials: {
        ...base.homeTestimonials,
        ...(parsed.homeTestimonials || {}),
        items:
          Array.isArray(parsed.homeTestimonials?.items) &&
          parsed.homeTestimonials.items.length
            ? parsed.homeTestimonials.items
            : base.homeTestimonials.items,
      },
      homeLookbook: {
        ...base.homeLookbook,
        ...(parsed.homeLookbook || {}),
        categories:
          Array.isArray(parsed.homeLookbook?.categories) &&
          parsed.homeLookbook.categories.length
            ? parsed.homeLookbook.categories
            : base.homeLookbook.categories,
        products:
          Array.isArray(parsed.homeLookbook?.products) &&
          parsed.homeLookbook.products.length
            ? parsed.homeLookbook.products
            : base.homeLookbook.products,
      },
      homeChrome: { ...base.homeChrome, ...(parsed.homeChrome || {}) },
      aboutSections:
        Array.isArray(parsed.aboutSections) && parsed.aboutSections.length
          ? parsed.aboutSections
          : base.aboutSections,
      aboutArticle:
        parsed.aboutArticle && typeof parsed.aboutArticle === "object"
          ? {
              title: parsed.aboutArticle.title ?? "",
              content: parsed.aboutArticle.content ?? "",
              imageUrl: parsed.aboutArticle.imageUrl ?? "",
            }
          : aboutArticleFromSections(
              Array.isArray(parsed.aboutSections) && parsed.aboutSections.length
                ? parsed.aboutSections
                : base.aboutSections,
            ),
      capabilityArticle:
        parsed.capabilityArticle && typeof parsed.capabilityArticle === "object"
          ? {
              title: parsed.capabilityArticle.title ?? "",
              content: parsed.capabilityArticle.content ?? "",
              imageUrl: parsed.capabilityArticle.imageUrl ?? "",
            }
          : base.capabilityArticle,
    };
  } catch {
    return base;
  }
}

export function newMediaItem(partial?: Partial<MediaListItem>): MediaListItem {
  return {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    link: "",
    imageUrl: "",
    sortOrder: 0,
    isVisible: true,
    ...partial,
  };
}
