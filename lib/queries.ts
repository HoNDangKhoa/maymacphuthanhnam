import { prisma } from "@/lib/prisma";
import { resolveMapEmbed } from "@/lib/site-settings";
import { CacheKeys, cacheRemember } from "@/lib/cache";
import {
  galleryItems as fallbackGallery,
  posts as fallbackPosts,
  workflowSteps as fallbackWorkflow,
  site as fallbackSite,
} from "@/lib/data";

export type PublicPost = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  type: "NEWS" | "CAPABILITY" | "SERVICE";
  date: string;
  thumbnail: string;
  contentHtml: string;
};

async function fetchPublishedPosts(type?: "NEWS" | "CAPABILITY" | "SERVICE") {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      isVisible: true,
      ...(type ? { type } : {}),
    },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary || "",
    category: p.category?.name || "Khác",
    type: p.type as "NEWS" | "CAPABILITY" | "SERVICE",
    date: (p.publishedAt || p.createdAt).toISOString().slice(0, 10),
    thumbnail:
      p.thumbnail ||
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&q=80",
    contentHtml: p.contentHtml,
  }));
}

export async function getPublishedPosts(
  type?: "NEWS" | "CAPABILITY" | "SERVICE",
) {
  try {
    const cacheKey = CacheKeys.posts(type || "ALL");
    const posts = await cacheRemember(cacheKey, () => fetchPublishedPosts(type));
    if (posts.length) return posts;
  } catch {
    // fallback
  }
  if (type === "SERVICE") {
    const { services } = await import("@/lib/data");
    return services.map((s) => ({
      slug: s.slug,
      title: s.title,
      summary: s.description,
      category: s.subtitle,
      type: "SERVICE" as const,
      date: new Date().toISOString().slice(0, 10),
      thumbnail: s.image,
      contentHtml: `<p>${s.description}</p>`,
    }));
  }
  return type ? fallbackPosts.filter((p) => p.type === type) : fallbackPosts;
}

export async function getPostBySlugFromDb(slug: string) {
  try {
    const post = await cacheRemember(CacheKeys.post(slug), async () => {
      const row = await prisma.post.findFirst({
        where: { slug, status: "PUBLISHED", isVisible: true },
        include: { category: true },
      });
      if (!row) return null;
      await prisma.post.update({
        where: { id: row.id },
        data: { views: { increment: 1 } },
      });
      return {
        slug: row.slug,
        title: row.title,
        summary: row.summary || "",
        category: row.category?.name || "Khác",
        type: row.type as "NEWS" | "CAPABILITY" | "SERVICE",
        date: (row.publishedAt || row.createdAt).toISOString().slice(0, 10),
        thumbnail:
          row.thumbnail ||
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&q=80",
        contentHtml: row.contentHtml,
      } satisfies PublicPost;
    });

    if (post) return post;
  } catch {
    // fallback
  }
  return (
    fallbackPosts.find((p) => p.slug === slug) ??
    (await (async () => {
      const { services } = await import("@/lib/data");
      const s = services.find((x) => x.slug === slug);
      if (!s) return null;
      return {
        slug: s.slug,
        title: s.title,
        summary: s.description,
        category: s.subtitle,
        type: "SERVICE" as const,
        date: new Date().toISOString().slice(0, 10),
        thumbnail: s.image,
        contentHtml: `<p>${s.description}</p>`,
      };
    })())
  );
}

export async function getActiveWorkflow() {
  try {
    const steps = await cacheRemember(CacheKeys.workflow, async () => {
      const rows = await prisma.workflowStep.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
      return rows.map((s) => ({
        stepNumber: s.stepNumber,
        title: s.title,
        subtitle: s.subtitle || "",
        description: s.description,
        imageUrl: s.imageUrl,
      }));
    });
    if (steps.length) return steps;
  } catch {
    // fallback
  }
  return fallbackWorkflow;
}

export async function getActiveGallery() {
  try {
    const items = await cacheRemember(CacheKeys.gallery, async () => {
      const rows = await prisma.galleryItem.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
      return rows.map((i) => ({
        id: i.id,
        title: i.title || undefined,
        caption: i.caption || undefined,
        imageUrl: i.imageUrl,
      }));
    });
    if (items.length) return items;
  } catch {
    // fallback
  }
  return fallbackGallery;
}

export async function getSiteSettings() {
  const { defaultBannerData, parseBannerData } = await import("@/lib/branding");
  const defaults = defaultBannerData();

  const withHomeDefaults = <T extends Record<string, unknown>>(row: T) => ({
    ...row,
    homeStats: Array.isArray(row.homeStats) && row.homeStats.length
      ? row.homeStats
      : defaults.homeStats,
    homeTrust:
      row.homeTrust && typeof row.homeTrust === "object"
        ? {
            ...defaults.homeTrust,
            ...(row.homeTrust as object),
            features:
              Array.isArray((row.homeTrust as { features?: unknown }).features) &&
              ((row.homeTrust as { features: unknown[] }).features.length > 0)
                ? (row.homeTrust as { features: typeof defaults.homeTrust.features })
                    .features
                : defaults.homeTrust.features,
          }
        : defaults.homeTrust,
    homeTestimonials:
      row.homeTestimonials && typeof row.homeTestimonials === "object"
        ? {
            ...defaults.homeTestimonials,
            ...(row.homeTestimonials as object),
            items:
              Array.isArray(
                (row.homeTestimonials as { items?: unknown }).items,
              ) &&
              ((row.homeTestimonials as { items: unknown[] }).items.length > 0)
                ? (
                    row.homeTestimonials as {
                      items: typeof defaults.homeTestimonials.items;
                    }
                  ).items
                : defaults.homeTestimonials.items,
          }
        : defaults.homeTestimonials,
    homeLookbook:
      row.homeLookbook && typeof row.homeLookbook === "object"
        ? {
            ...defaults.homeLookbook,
            ...(row.homeLookbook as object),
            categories:
              Array.isArray(
                (row.homeLookbook as { categories?: unknown }).categories,
              ) &&
              ((row.homeLookbook as { categories: unknown[] }).categories
                .length > 0)
                ? (
                    row.homeLookbook as {
                      categories: typeof defaults.homeLookbook.categories;
                    }
                  ).categories
                : defaults.homeLookbook.categories,
            products:
              Array.isArray(
                (row.homeLookbook as { products?: unknown }).products,
              ) &&
              ((row.homeLookbook as { products: unknown[] }).products.length > 0)
                ? (
                    row.homeLookbook as {
                      products: typeof defaults.homeLookbook.products;
                    }
                  ).products
                : defaults.homeLookbook.products,
          }
        : defaults.homeLookbook,
    homeChrome:
      row.homeChrome && typeof row.homeChrome === "object"
        ? { ...defaults.homeChrome, ...(row.homeChrome as object) }
        : defaults.homeChrome,
    aboutSections:
      Array.isArray(row.aboutSections) && row.aboutSections.length
        ? row.aboutSections
        : defaults.aboutSections,
  });

  try {
    const settings = await cacheRemember(CacheKeys.settings, async () => {
      const s = await prisma.siteSetting.findUnique({
        where: { id: "site_config" },
      });
      if (!s) return null;
      const banner = parseBannerData(s.bannerData);
      const social = s.socialLinks
        ? (JSON.parse(s.socialLinks) as Record<string, string>)
        : {};
      return {
        name: "Phú Thành Nam",
        fullName: s.companyName,
        slogan: s.slogan || fallbackSite.slogan,
        hotline: s.hotline || fallbackSite.hotline,
        phone: s.phone || "",
        email: s.email || fallbackSite.email,
        workingHours: s.workingHours || "",
        headOffice: s.headOffice || fallbackSite.headOffice,
        factoryAddress: s.factoryAddress || fallbackSite.factoryAddress,
        website: s.website || "",
        mapsEmbedUrl: resolveMapEmbed(s.mapsEmbedUrl, s.mapsCoords),
        metaTitle: s.metaTitle || "",
        metaDescription: s.metaDescription || "",
        seoKeywords: s.seoKeywords || "",
        googleAnalytics: s.googleAnalytics || "",
        googleWebmaster: s.googleWebmaster || "",
        headJs: s.headJs || "",
        bodyJs: s.bodyJs || "",
        logoUrl: banner.logo.visible ? banner.logo.url : "",
        faviconUrl: banner.favicon.visible ? banner.favicon.url : "",
        heroVideoUrl: banner.video.visible ? banner.video.url.trim() : "",
        slideshow: banner.slideshow.filter((i) => i.isVisible && i.imageUrl),
        socialFooter: banner.socialFooter.filter((i) => i.isVisible),
        footer: banner.footer,
        pageSeo: banner.pageSeo,
        hero: banner.hero,
        homeStats: banner.homeStats,
        homeTrust: banner.homeTrust,
        homeTestimonials: banner.homeTestimonials,
        homeLookbook: banner.homeLookbook,
        homeChrome: banner.homeChrome,
        aboutSections: banner.aboutSections,
        social,
      };
    });
    if (settings) return withHomeDefaults(settings);
  } catch {
    // fallback
  }
  return withHomeDefaults({
    ...fallbackSite,
    phone: "",
    workingHours: "",
    website: "",
    mapsEmbedUrl: resolveMapEmbed(),
    metaTitle: "",
    metaDescription: "",
    seoKeywords: "",
    googleAnalytics: "",
    googleWebmaster: "",
    headJs: "",
    bodyJs: "",
    logoUrl: "",
    faviconUrl: "",
    heroVideoUrl: "",
    slideshow: [] as {
      id: string;
      title: string;
      link: string;
      imageUrl: string;
    }[],
    socialFooter: [] as {
      id: string;
      title: string;
      link: string;
      imageUrl: string;
    }[],
    footer: defaults.footer,
    pageSeo: defaults.pageSeo,
    hero: defaults.hero,
    homeStats: defaults.homeStats,
    homeTrust: defaults.homeTrust,
    homeTestimonials: defaults.homeTestimonials,
    homeLookbook: defaults.homeLookbook,
    homeChrome: defaults.homeChrome,
    aboutSections: defaults.aboutSections,
    social: {} as Record<string, string>,
  });
}
