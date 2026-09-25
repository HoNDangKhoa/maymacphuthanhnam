"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { invalidateCmsCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/cms";

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

  if (!title) throw new Error("Thiếu tiêu đề");

  const slug = slugify(slugInput || title);
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
  if (id) {
    await prisma.post.update({ where: { id }, data });
  } else {
    const created = await prisma.post.create({ data });
    savedId = created.id;
  }

  await revalidatePublic([slug]);
  revalidatePath("/admin/posts");
  revalidatePath("/admin/content/news");
  revalidatePath("/admin/content/capabilities");
  revalidatePath("/admin/content/services");
  return { ok: true, slug, id: savedId };
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
  await prisma.siteSetting.upsert({
    where: { id: "site_config" },
    update: {
      companyName: String(formData.get("companyName") || ""),
      slogan: String(formData.get("slogan") || "") || null,
      hotline: String(formData.get("hotline") || "") || null,
      phone: String(formData.get("phone") || "") || null,
      email: String(formData.get("email") || "") || null,
      workingHours: String(formData.get("workingHours") || "") || null,
      headOffice: String(formData.get("headOffice") || "") || null,
      factoryAddress: String(formData.get("factoryAddress") || "") || null,
      website: String(formData.get("website") || "") || null,
      mapsCoords: String(formData.get("mapsCoords") || "") || null,
      mapsEmbedUrl: String(formData.get("mapsEmbedUrl") || "") || null,
      googleAnalytics: String(formData.get("googleAnalytics") || "") || null,
      googleWebmaster: String(formData.get("googleWebmaster") || "") || null,
      headJs: String(formData.get("headJs") || "") || null,
      bodyJs: String(formData.get("bodyJs") || "") || null,
      metaTitle: String(formData.get("metaTitle") || "") || null,
      metaDescription: String(formData.get("metaDescription") || "") || null,
      seoKeywords: String(formData.get("seoKeywords") || "") || null,
      primaryKeyword: String(formData.get("primaryKeyword") || "") || null,
      mailerHost: String(formData.get("mailerHost") || "") || null,
      mailerPort: String(formData.get("mailerPort") || "") || null,
      mailerSecure: String(formData.get("mailerSecure") || "") || null,
      mailerEmail: String(formData.get("mailerEmail") || "") || null,
      mailerPassword: String(formData.get("mailerPassword") || "") || null,
      socialLinks: JSON.stringify({
        facebook: String(formData.get("fanpage") || ""),
        fanpage: String(formData.get("fanpage") || ""),
        linkedin: String(formData.get("linkedin") || ""),
        zalo: String(formData.get("zalo") || ""),
        oaidZalo: String(formData.get("oaidZalo") || ""),
      }),
    },
    create: {
      id: "site_config",
      companyName: String(formData.get("companyName") || "Phú Thành Nam"),
    },
  });
  await revalidatePublic();
  revalidatePath("/admin/settings");
  revalidatePath("/admin/seo");
  revalidatePath("/admin/branding/social");
  revalidatePath("/admin/static/about");
  revalidatePath("/admin/static/footer");
  revalidatePath("/admin/home/hero");
}

export async function togglePostPublished(id: string, published: boolean) {
  await requireAdmin();
  await prisma.post.update({
    where: { id },
    data: {
      status: published ? "PUBLISHED" : "DRAFT",
      isVisible: published,
      publishedAt: published ? new Date() : null,
    },
  });
  await revalidatePublic();
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
  await prisma.post.update({ where: { id }, data });
  await revalidatePublic();
  revalidatePath("/admin/content/news");
  revalidatePath("/admin/content/capabilities");
  revalidatePath("/admin/content/services");
  revalidatePath("/admin/posts");
}

export async function updatePostSortOrder(id: string, sortOrder: number) {
  await requireAdmin();
  await prisma.post.update({
    where: { id },
    data: { sortOrder },
  });
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
