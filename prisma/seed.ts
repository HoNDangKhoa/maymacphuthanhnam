import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  galleryItems,
  posts,
  services,
  site,
  workflowSteps,
} from "../lib/data";
import { defaultBannerData, newMediaItem } from "../lib/branding";

const prisma = new PrismaClient();

export async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@phuthanhnam.vn";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "PTN Admin", role: "SUPER_ADMIN" },
    create: {
      name: "PTN Admin",
      email,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: "site_config" },
    update: {
      companyName: site.fullName,
      slogan: site.slogan,
      hotline: site.hotline,
      email: site.email,
      headOffice: site.headOffice,
      factoryAddress: site.factoryAddress,
      mapsEmbedUrl:
        "https://maps.google.com/maps?q=Binh%20Duong%20Industrial%20Park&t=&z=13&ie=UTF8&iwloc=&output=embed",
      metaTitle: "May Mặc Phú Thành Nam",
      metaDescription:
        "Đối tác gia công OEM/ODM & CMT chuẩn xuất khẩu.",
      socialLinks: JSON.stringify({
        facebook: "",
        linkedin: "",
        zalo: "",
      }),
      bannerData: JSON.stringify({
        ...defaultBannerData(),
        slideshow: [
          newMediaItem({
            title: "Hero 1",
            link: "/gioi-thieu",
            imageUrl:
              "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1800&q=80",
            sortOrder: 0,
          }),
          newMediaItem({
            title: "Hero 2",
            link: "/dich-vu",
            imageUrl:
              "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1800&q=80",
            sortOrder: 1,
          }),
          newMediaItem({
            title: "Hero 3",
            link: "/nang-luc-san-xuat",
            imageUrl:
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=80",
            sortOrder: 2,
          }),
        ],
      }),
    },
    create: {
      id: "site_config",
      companyName: site.fullName,
      slogan: site.slogan,
      hotline: site.hotline,
      email: site.email,
      headOffice: site.headOffice,
      factoryAddress: site.factoryAddress,
      mapsEmbedUrl:
        "https://maps.google.com/maps?q=Binh%20Duong%20Industrial%20Park&t=&z=13&ie=UTF8&iwloc=&output=embed",
      metaTitle: "May Mặc Phú Thành Nam",
      metaDescription:
        "Đối tác gia công OEM/ODM & CMT chuẩn xuất khẩu.",
      socialLinks: JSON.stringify({
        facebook: "",
        linkedin: "",
        zalo: "",
      }),
      bannerData: JSON.stringify({
        ...defaultBannerData(),
        slideshow: [
          newMediaItem({
            title: "Hero 1",
            link: "/gioi-thieu",
            imageUrl:
              "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1800&q=80",
            sortOrder: 0,
          }),
          newMediaItem({
            title: "Hero 2",
            link: "/dich-vu",
            imageUrl:
              "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1800&q=80",
            sortOrder: 1,
          }),
          newMediaItem({
            title: "Hero 3",
            link: "/nang-luc-san-xuat",
            imageUrl:
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=80",
            sortOrder: 2,
          }),
        ],
      }),
    },
  });

  const categoryNames = [
    ...new Set(posts.map((p) => `${p.type}::${p.category}`)),
  ];

  const categoryMap = new Map<string, string>();
  for (const key of categoryNames) {
    const [type, name] = key.split("::");
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const cat = await prisma.category.upsert({
      where: { slug: `${type.toLowerCase()}-${slug}` },
      update: { name, type },
      create: {
        name,
        slug: `${type.toLowerCase()}-${slug}`,
        type,
      },
    });
    categoryMap.set(key, cat.id);
  }

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        summary: post.summary,
        contentHtml: post.contentHtml,
        thumbnail: post.thumbnail,
        type: post.type,
        status: "PUBLISHED",
        isVisible: true,
        categoryId: categoryMap.get(`${post.type}::${post.category}`),
        authorId: admin.id,
        createdAt: new Date(post.date),
      },
      create: {
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        contentHtml: post.contentHtml,
        thumbnail: post.thumbnail,
        type: post.type,
        status: "PUBLISHED",
        isVisible: true,
        categoryId: categoryMap.get(`${post.type}::${post.category}`),
        authorId: admin.id,
        createdAt: new Date(post.date),
      },
    });
  }

  for (const [index, service] of services.entries()) {
    const catSlug = `service-${service.slug}`;
    const cat = await prisma.category.upsert({
      where: { slug: catSlug },
      update: { name: service.subtitle, type: "SERVICE" },
      create: {
        name: service.subtitle,
        slug: catSlug,
        type: "SERVICE",
      },
    });

    await prisma.post.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        summary: service.description,
        contentHtml: `<h2>${service.subtitle}</h2><p>${service.description}</p>`,
        thumbnail: service.image,
        type: "SERVICE",
        status: "PUBLISHED",
        isVisible: true,
        sortOrder: index,
        categoryId: cat.id,
        authorId: admin.id,
      },
      create: {
        title: service.title,
        slug: service.slug,
        summary: service.description,
        contentHtml: `<h2>${service.subtitle}</h2><p>${service.description}</p>`,
        thumbnail: service.image,
        type: "SERVICE",
        status: "PUBLISHED",
        isVisible: true,
        sortOrder: index,
        categoryId: cat.id,
        authorId: admin.id,
      },
    });
  }

  await prisma.workflowStep.deleteMany();
  await prisma.workflowStep.createMany({
    data: workflowSteps.map((step, index) => ({
      stepNumber: step.stepNumber,
      title: step.title,
      subtitle: step.subtitle,
      description: step.description,
      imageUrl: step.imageUrl,
      sortOrder: index,
      isActive: true,
    })),
  });

  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: galleryItems.map((item, index) => ({
      title: item.title,
      caption: item.caption,
      imageUrl: item.imageUrl,
      altText: item.title,
      sortOrder: index,
      isActive: true,
    })),
  });

  await prisma.contactInquiry.deleteMany();
  await prisma.contactInquiry.createMany({
    data: [
      {
        fullName: "Nguyễn Minh Anh",
        companyName: "Fashion House",
        email: "minhanh@fashion.vn",
        phone: "0901234567",
        serviceType: "Gia công FOB",
        message: "Cần báo giá lô áo khoác softshell 5.000 pcs.",
        status: "NEW",
      },
      {
        fullName: "Trần Quốc Huy",
        companyName: "Export Label",
        email: "huy@export.com",
        phone: "0912345678",
        serviceType: "Gia công CMT",
        message: "CMT blazer công sở, techpack đính kèm.",
        status: "CONTACTED",
      },
      {
        fullName: "Lê Thu Hà",
        companyName: "Uniform Co",
        email: "ha@uniform.vn",
        phone: "0987654321",
        serviceType: "Đặt may mẫu",
        message: "Làm mẫu đồng phục xuất khẩu trong 10 ngày.",
        status: "PROCESSING",
      },
    ],
  });

  console.log("✅ Seed OK");
  console.log(`   Admin: ${email} / ${password}`);
}

const isCli =
  typeof process !== "undefined" &&
  Boolean(process.argv[1]?.match(/prisma[/\\]seed\.(ts|js)$/));

if (isCli) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
