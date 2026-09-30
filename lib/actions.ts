"use server";

import { revalidatePath } from "next/cache";
import { auth, unstable_update } from "@/auth";
import { invalidateCmsCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/cms";
import { productSlug } from "@/lib/home-content";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

async function revalidatePublic(slugs: string[] = []) {
  await invalidateCmsCache(slugs);
  revalidatePath("/");
  revalidatePath("/tin-tuc");
  revalidatePath("/nang-luc-san-xuat");
  revalidatePath("/dich-vu");
  revalidatePath("/san-pham", "layout");
  revalidatePath("/lien-he");
  revalidatePath("/gioi-thieu");
  revalidatePath("/admin");
}

export async function savePost(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const contentHtml = String(formData.get("contentHtml") || "");
  const thumbnail = String(formData.get("thumbnail") || "").trim() || null;
  const type = String(formData.get("type") || "NEWS");
  const status = String(formData.get("status") || "DRAFT").toUpperCase();
  const categoryName = String(formData.get("categoryName") || "").trim();
  const metaTitle = String(formData.get("metaTitle") || "").trim() || null;
  const metaDescription =
    String(formData.get("metaDescription") || "").trim() || null;
  const seoKeywords = String(formData.get("seoKeywords") || "").trim() || null;
  const canonicalUrl =
    String(formData.get("canonicalUrl") || "").trim() || null;
  const tags = String(formData.get("tags") || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const isVisible = String(formData.get("isVisible") || "1") === "1";
  const isFeatured = String(formData.get("isFeatured") || "0") === "1";
  const isNew = String(formData.get("isNew") || "0") === "1";
  const publishedRaw = String(formData.get("publishedAt") || "").trim();
  const publishedAt = publishedRaw ? new Date(publishedRaw) : null;

  if (!title) return { ok: false as const, error: "Vui lòng nhập tiêu đề." };

  const base = slugify(slugInput || title) || `bai-viet-${Date.now()}`;
  let slug = base;
  for (let n = 2; ; n++) {
    const clash = await prisma.post.findFirst({
      where: { slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (!clash) break;
    slug = `${base}-${n}`;
  }
  let categoryId: string | null = null;
  if (categoryName) {
    const catSlug = `${type.toLowerCase()}-${slugify(categoryName)}`;
    const cat = await prisma.category.upsert({
      where: { slug: catSlug },
      update: { name: categoryName, type },
      create: { name: categoryName, slug: catSlug, type },
    });
    categoryId = cat.id;
  }

  const normalizedStatus =
    status === "PUBLISHED" || status === "REVIEW" || status === "ARCHIVED"
      ? status
      : "DRAFT";

  const data = {
    title,
    slug,
    summary: summary || null,
    contentHtml,
    thumbnail,
    type,
    status: normalizedStatus,
    categoryId,
    metaTitle,
    metaDescription,
    seoKeywords,
    canonicalUrl,
    tags,
    sortOrder,
    isVisible,
    isFeatured,
    isNew,
    publishedAt:
      normalizedStatus === "PUBLISHED"
        ? publishedAt || new Date()
        : publishedAt,
    authorId: session.user!.id,
  };

  let savedId = id;
  let oldSlug: string | undefined;
  try {
    if (id) {
      const existing = await prisma.post.findUnique({
        where: { id },
        select: { slug: true },
      });
      if (!existing) {
        return { ok: false as const, error: "Bài viết không còn tồn tại." };
      }
      oldSlug = existing.slug;
      await prisma.post.update({ where: { id }, data });
    } else {
      const created = await prisma.post.create({ data });
      savedId = created.id;
    }
  } catch (error) {
    console.error("[savePost]", error);
    return { ok: false as const, error: "Không lưu được bài viết. Vui lòng thử lại." };
  }

  await revalidatePublic([slug, ...(oldSlug ? [oldSlug] : [])]);
  revalidatePath("/admin/posts");
  revalidatePath("/admin/content/news");
  revalidatePath("/admin/content/capabilities");
  revalidatePath("/admin/content/services");
  return { ok: true as const, slug, id: savedId };
}

export async function deletePost(id: string) {
  await requireAdmin();
  const post = await prisma.post.findUnique({ where: { id } });
  await prisma.post.delete({ where: { id } });
  await revalidatePublic(post?.slug ? [post.slug] : []);
  revalidatePath("/admin/posts");
  revalidatePath("/admin/content/news");
  revalidatePath("/admin/content/capabilities");
  revalidatePath("/admin/content/services");
}

const POST_TYPES = ["NEWS", "CAPABILITY", "SERVICE"];

function revalidateCategoryPages() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/content/news");
  revalidatePath("/admin/content/capabilities");
  revalidatePath("/admin/content/services");
}

export async function saveCategory(input: {
  id?: string;
  name: string;
  type: string;
}) {
  await requireAdmin();
  const name = input.name.trim();
  const type = POST_TYPES.includes(input.type) ? input.type : "NEWS";
  if (!name) return { ok: false as const, error: "Vui lòng nhập tên danh mục." };
  const slug = `${type.toLowerCase()}-${slugify(name)}`;
  const clash = await prisma.category.findFirst({
    where: { slug, ...(input.id ? { NOT: { id: input.id } } : {}) },
    select: { id: true },
  });
  if (clash) {
    return { ok: false as const, error: "Danh mục này đã tồn tại." };
  }
  if (input.id) {
    await prisma.category.update({
      where: { id: input.id },
      data: { name, type, slug },
    });
  } else {
    await prisma.category.create({ data: { name, type, slug } });
  }
  await revalidatePublic();
  revalidateCategoryPages();
  return { ok: true as const };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.$transaction([
    prisma.post.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    }),
    prisma.category.delete({ where: { id } }),
  ]);
  await revalidatePublic();
  revalidateCategoryPages();
  return { ok: true as const };
}

export async function saveWorkflowStep(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const stepNumber = String(formData.get("stepNumber") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim() || null;
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  if (!stepNumber || !title || !description || !imageUrl) {
    throw new Error("Thiếu thông tin bước quy trình");
  }

  if (id) {
    await prisma.workflowStep.update({
      where: { id },
      data: { stepNumber, title, subtitle, description, imageUrl, isActive },
    });
  } else {
    const count = await prisma.workflowStep.count();
    await prisma.workflowStep.create({
      data: {
        stepNumber,
        title,
        subtitle,
        description,
        imageUrl,
        isActive,
        sortOrder: count,
      },
    });
  }

  await revalidatePublic();
  revalidatePath("/admin/workflow");
  revalidatePath("/admin/home/workflow");
}

export async function deleteWorkflowStep(id: string) {
  await requireAdmin();
  await prisma.workflowStep.delete({ where: { id } });
  await revalidatePublic();
  revalidatePath("/admin/workflow");
  revalidatePath("/admin/home/workflow");
}

export async function reorderWorkflow(ids: string[]) {
  await requireAdmin();
  await Promise.all(
    ids.map((id, index) =>
      prisma.workflowStep.update({
        where: { id },
        data: {
          sortOrder: index,
          stepNumber: String(index + 1).padStart(2, "0"),
        },
      }),
    ),
  );
  await revalidatePublic();
  revalidatePath("/admin/workflow");
  revalidatePath("/admin/home/workflow");
}

export async function saveGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim() || null;
  const caption = String(formData.get("caption") || "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const altText = String(formData.get("altText") || "").trim() || title;
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  if (!imageUrl) throw new Error("Thiếu ảnh");

  if (id) {
    await prisma.galleryItem.update({
      where: { id },
      data: { title, caption, imageUrl, altText, isActive },
    });
  } else {
    const count = await prisma.galleryItem.count();
    await prisma.galleryItem.create({
      data: {
        title,
        caption,
        imageUrl,
        altText,
        isActive,
        sortOrder: count,
      },
    });
  }

  await revalidatePublic();
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/branding/gallery");
}

export async function deleteGalleryItem(id: string) {
  await requireAdmin();
  await prisma.galleryItem.delete({ where: { id } });
  await revalidatePublic();
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/branding/gallery");
}

export async function reorderGallery(ids: string[]) {
  await requireAdmin();
  await Promise.all(
    ids.map((id, index) =>
      prisma.galleryItem.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
  await revalidatePublic();
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/branding/gallery");
}

export async function toggleGalleryActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.galleryItem.update({ where: { id }, data: { isActive } });
  await revalidatePublic();
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/branding/gallery");
}

export async function updateInquiryStatus(id: string, status: string, notes?: string) {
  await requireAdmin();
  await prisma.contactInquiry.update({
    where: { id },
    data: { status, notes: notes ?? undefined },
  });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  await prisma.contactInquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/contacts");
  revalidatePath("/admin");
}

export async function saveSiteSettings(formData: FormData) {
  await requireAdmin();
  const text = (key: string) => String(formData.get(key) ?? "").trim() || null;
  const companyName = text("companyName");
  if (!companyName) {
    return { ok: false as const, error: "Vui lòng nhập tiêu đề (tên công ty)." };
  }
  const data = {
    companyName,
    slogan: text("slogan"),
    hotline: text("hotline"),
    phone: text("phone"),
    email: text("email"),
    workingHours: text("workingHours"),
    headOffice: text("headOffice"),
    factoryAddress: text("factoryAddress"),
    website: text("website"),
    mapsCoords: text("mapsCoords"),
    mapsEmbedUrl: text("mapsEmbedUrl"),
    googleAnalytics: text("googleAnalytics"),
    googleWebmaster: text("googleWebmaster"),
    headJs: text("headJs"),
    bodyJs: text("bodyJs"),
    metaTitle: text("metaTitle"),
    metaDescription: text("metaDescription"),
    seoKeywords: text("seoKeywords"),
    primaryKeyword: text("primaryKeyword"),
    mailerHost: text("mailerHost"),
    mailerPort: text("mailerPort"),
    mailerSecure: text("mailerSecure"),
    mailerEmail: text("mailerEmail"),
    mailerPassword: text("mailerPassword"),
    socialLinks: JSON.stringify({
      facebook: text("fanpage") ?? "",
      fanpage: text("fanpage") ?? "",
      linkedin: text("linkedin") ?? "",
      zalo: text("zalo") ?? "",
      oaidZalo: text("oaidZalo") ?? "",
    }),
  };
  await prisma.siteSetting.upsert({
    where: { id: "site_config" },
    update: data,
    create: { id: "site_config", ...data },
  });
  await revalidatePublic();
  revalidatePath("/admin/settings");
  revalidatePath("/admin/seo");
  revalidatePath("/admin/branding/social");
  revalidatePath("/admin/static/about");
  revalidatePath("/admin/static/footer");
  revalidatePath("/admin/home/hero");
  return { ok: true as const };
}

export async function togglePostPublished(id: string, published: boolean) {
  await requireAdmin();
  const post = await prisma.post.update({
    where: { id },
    data: {
      status: published ? "PUBLISHED" : "DRAFT",
      isVisible: published,
      publishedAt: published ? new Date() : null,
    },
    select: { slug: true },
  });
  await revalidatePublic([post.slug]);
  revalidatePath("/admin/content/news");
  revalidatePath("/admin/content/capabilities");
  revalidatePath("/admin/content/services");
  revalidatePath("/admin/posts");
}

export async function togglePostFlag(
  id: string,
  field: "isNew" | "isVisible" | "isFeatured",
  value: boolean,
) {
  await requireAdmin();
  const data: Record<string, boolean | string | Date | null> = { [field]: value };
  if (field === "isVisible") {
    data.status = value ? "PUBLISHED" : "DRAFT";
    data.publishedAt = value ? new Date() : null;
  }
  const post = await prisma.post.update({
    where: { id },
    data,
    select: { slug: true },
  });
  await revalidatePublic([post.slug]);
  revalidatePath("/admin/content/news");
  revalidatePath("/admin/content/capabilities");
  revalidatePath("/admin/content/services");
  revalidatePath("/admin/posts");
}

export async function updatePostSortOrder(id: string, sortOrder: number) {
  await requireAdmin();
  const post = await prisma.post.update({
    where: { id },
    data: { sortOrder },
    select: { slug: true },
  });
  await revalidatePublic([post.slug]);
  revalidatePath("/admin/content/news");
  revalidatePath("/admin/content/capabilities");
  revalidatePath("/admin/content/services");
  revalidatePath("/admin/posts");
}

export async function changePassword(formData: FormData) {
  const bcrypt = (await import("bcryptjs")).default;
  const session = await requireAdmin();
  const current = String(formData.get("currentPassword") || "");
  const next = String(formData.get("newPassword") || "");
  const confirm = String(formData.get("confirmPassword") || "");

  if (next.length < 6) {
    return { ok: false as const, error: "Mật khẩu mới tối thiểu 6 ký tự." };
  }
  if (next !== confirm) {
    return { ok: false as const, error: "Mật khẩu nhập lại không khớp." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user!.id },
  });
  if (!user) return { ok: false as const, error: "Không tìm thấy tài khoản." };

  const valid = await bcrypt.compare(current, user.passwordHash);
  if (!valid) {
    return { ok: false as const, error: "Mật khẩu hiện tại không đúng." };
  }

  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { ok: true as const };
}

export async function updateAccount(input: { name: string; email: string }) {
  const session = await requireAdmin();
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name) return { ok: false as const, error: "Vui lòng nhập họ tên." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "Email không hợp lệ." };
  }
  const clash = await prisma.user.findFirst({
    where: { email, NOT: { id: session.user!.id } },
    select: { id: true },
  });
  if (clash) return { ok: false as const, error: "Email đã được dùng cho tài khoản khác." };
  await prisma.user.update({
    where: { id: session.user!.id },
    data: { name, email },
  });
  await unstable_update({ user: { name, email } });
  revalidatePath("/admin", "layout");
  return { ok: true as const };
}

async function getOrCreateBanner() {
  const row = await prisma.siteSetting.findUnique({
    where: { id: "site_config" },
  });
  const { parseBannerData } = await import("@/lib/branding");
  return {
    raw: row,
    data: parseBannerData(row?.bannerData),
  };
}

async function saveBannerData(
  mutator: (data: import("@/lib/branding").BannerData) => import("@/lib/branding").BannerData,
) {
  await requireAdmin();
  const { data } = await getOrCreateBanner();
  const next = mutator(data);
  await prisma.siteSetting.upsert({
    where: { id: "site_config" },
    update: { bannerData: JSON.stringify(next) },
    create: {
      id: "site_config",
      companyName: "Công ty May Mặc Phú Thành Nam",
      bannerData: JSON.stringify(next),
    },
  });
  await revalidatePublic();
  revalidatePath("/admin/home/hero");
  revalidatePath("/admin/home/stats");
  revalidatePath("/admin/home/trust");
  revalidatePath("/admin/home/testimonials");
  revalidatePath("/admin/home/lookbook");
  revalidatePath("/admin/home/chrome");
  revalidatePath("/admin/static/about");
  revalidatePath("/admin/branding/logo");
  revalidatePath("/admin/branding/favicon");
  revalidatePath("/admin/branding/video");
  revalidatePath("/admin/branding/slideshow");
  revalidatePath("/admin/branding/social");
  revalidatePath("/admin/static/footer");
  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/news");
  revalidatePath("/admin/seo/capability");
  revalidatePath("/admin/seo/service");
  return next;
}

export async function saveBrandAsset(
  kind: "logo" | "favicon" | "video",
  payload: { url: string; visible: boolean },
) {
  await saveBannerData((data) => ({
    ...data,
    [kind]: { url: payload.url, visible: payload.visible },
  }));
}

export async function saveHeroContent(
  hero: import("@/lib/branding").HeroContent,
) {
  await saveBannerData((data) => ({ ...data, hero }));
}

export async function saveHomeStats(
  homeStats: import("@/lib/home-content").HomeStatItem[],
) {
  await saveBannerData((data) => ({ ...data, homeStats }));
}

export async function saveHomeTrust(
  homeTrust: import("@/lib/home-content").HomeTrustContent,
) {
  await saveBannerData((data) => ({ ...data, homeTrust }));
}

export async function saveHomeTestimonials(
  homeTestimonials: import("@/lib/home-content").HomeTestimonialsContent,
) {
  await saveBannerData((data) => ({ ...data, homeTestimonials }));
}

export async function saveHomeLookbook(
  headings: Pick<
    import("@/lib/home-content").HomeLookbookContent,
    "eyebrow" | "title" | "description"
  >,
) {
  await saveBannerData((data) => ({
    ...data,
    homeLookbook: {
      ...data.homeLookbook,
      eyebrow: headings.eyebrow,
      title: headings.title,
      description: headings.description,
    },
  }));
}

export async function saveProduct(
  product: import("@/lib/home-content").HomeLookbookProduct,
) {
  const name = product.name.trim();
  if (!name) return { ok: false as const, error: "Vui lòng nhập tên sản phẩm." };

  let savedSlug = "";
  await saveBannerData((data) => {
    const products = [...data.homeLookbook.products];
    const others = products.filter((p) => p.id !== product.id);
    const base = slugify(product.slug?.trim() || name) || product.id;
    let slug = base;
    for (let n = 2; others.some((p) => productSlug(p) === slug); n++) {
      slug = `${base}-${n}`;
    }
    savedSlug = slug;
    const next = {
      ...product,
      name,
      slug,
      label: product.label.trim() || name.toUpperCase(),
      gallery: (product.gallery ?? []).filter(Boolean),
    };
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) products[index] = next;
    else products.push(next);
    return { ...data, homeLookbook: { ...data.homeLookbook, products } };
  });
  revalidatePath("/admin/products");
  return { ok: true as const, slug: savedSlug };
}

export async function deleteProduct(id: string) {
  await saveBannerData((data) => ({
    ...data,
    homeLookbook: {
      ...data.homeLookbook,
      products: data.homeLookbook.products.filter((p) => p.id !== id),
    },
  }));
  revalidatePath("/admin/products");
}

export async function deleteProducts(ids: string[]) {
  await saveBannerData((data) => ({
    ...data,
    homeLookbook: {
      ...data.homeLookbook,
      products: data.homeLookbook.products.filter((p) => !ids.includes(p.id)),
    },
  }));
  revalidatePath("/admin/products");
}

export async function setProductPosition(id: string, position: number) {
  await saveBannerData((data) => {
    const products = [...data.homeLookbook.products];
    const from = products.findIndex((p) => p.id === id);
    if (from < 0) return data;
    const [item] = products.splice(from, 1);
    const to = Math.min(Math.max(Math.round(position) - 1, 0), products.length);
    products.splice(to, 0, item!);
    return { ...data, homeLookbook: { ...data.homeLookbook, products } };
  });
  revalidatePath("/admin/products");
}

export async function setProductVisible(id: string, isVisible: boolean) {
  await saveBannerData((data) => ({
    ...data,
    homeLookbook: {
      ...data.homeLookbook,
      products: data.homeLookbook.products.map((p) =>
        p.id === id ? { ...p, isVisible } : p,
      ),
    },
  }));
  revalidatePath("/admin/products");
}

export async function saveProductCategories(
  categories: string[],
  categoryInfo: Record<string, import("@/lib/home-content").ProductCategoryInfo>,
) {
  const keys = [
    ...new Set(categories.map((c) => c.trim().toUpperCase()).filter(Boolean)),
  ];
  if (!keys.length) {
    return { ok: false as const, error: "Cần ít nhất một danh mục." };
  }
  await saveBannerData((data) => ({
    ...data,
    homeLookbook: {
      ...data.homeLookbook,
      categories: keys,
      categoryInfo: Object.fromEntries(
        keys.map((k) => [k, categoryInfo[k] ?? { name: "", description: "", image: "" }]),
      ),
    },
  }));
  revalidatePath("/admin/product-categories");
  return { ok: true as const };
}

export async function saveHomeChrome(
  homeChrome: import("@/lib/home-content").HomeSectionChrome,
) {
  await saveBannerData((data) => ({ ...data, homeChrome }));
}

export async function saveAboutSections(
  aboutSections: import("@/lib/home-content").AboutSectionItem[],
) {
  await saveBannerData((data) => ({ ...data, aboutSections }));
}

export async function saveSlideshowItems(
  items: import("@/lib/branding").MediaListItem[],
) {
  await saveBannerData((data) => ({ ...data, slideshow: items }));
}

export async function saveSocialFooterItems(
  items: import("@/lib/branding").MediaListItem[],
) {
  await saveBannerData((data) => ({ ...data, socialFooter: items }));
}

export async function saveFooterContent(
  footer: import("@/lib/branding").FooterContent,
) {
  await saveBannerData((data) => ({ ...data, footer }));
}

export async function savePageSeo(
  key: string,
  seo: import("@/lib/branding").PageSeo,
) {
  await saveBannerData((data) => ({
    ...data,
    pageSeo: { ...data.pageSeo, [key]: seo },
  }));
}

export async function sendTestMail() {
  await requireAdmin();
  try {
    const { sendTestEmail } = await import("@/lib/mailer");
    const to = await sendTestEmail();
    return { ok: true as const, to };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Gửi email thất bại",
    };
  }
}
