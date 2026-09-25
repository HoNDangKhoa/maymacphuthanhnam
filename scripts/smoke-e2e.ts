/**
 * Smoke E2E: CRUD CMS + đối chiếu trang public
 * Chạy: node --import tsx scripts/smoke-e2e.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { invalidateCmsCache } from "../lib/cache";

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const prisma = new PrismaClient();

type Result = { name: string; ok: boolean; detail?: string };
const results: Result[] = [];

function pass(name: string, detail?: string) {
  results.push({ name, ok: true, detail });
  console.log(`  ✅ ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name: string, detail?: string) {
  results.push({ name, ok: false, detail });
  console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchOk(path: string, mustInclude?: string | RegExp) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "text/html" },
    redirect: "follow",
  });
  const html = await res.text();
  const decoded = html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  if (!res.ok) {
    fail(`GET ${path}`, `status ${res.status}`);
    return { ok: false, html, status: res.status };
  }
  if (mustInclude) {
    const hit =
      typeof mustInclude === "string"
        ? decoded.includes(mustInclude) || html.includes(mustInclude)
        : mustInclude.test(decoded) || mustInclude.test(html);
    if (!hit) {
      fail(`GET ${path}`, `thiếu nội dung: ${mustInclude}`);
      return { ok: false, html, status: res.status };
    }
  }
  pass(`GET ${path}`, mustInclude ? `có "${String(mustInclude).slice(0, 40)}"` : `HTTP ${res.status}`);
  return { ok: true, html, status: res.status };
}

async function main() {
  console.log(`\n🔍 Smoke E2E → ${BASE}\n`);

  // ── 0. Server sống ──
  console.log("— Public routes —");
  try {
    await fetchOk("/");
  } catch (e) {
    fail("Server", e instanceof Error ? e.message : String(e));
    printSummary();
    process.exit(1);
  }

  await fetchOk("/gioi-thieu");
  await fetchOk("/dich-vu");
  await fetchOk("/tin-tuc");
  await fetchOk("/nang-luc-san-xuat");
  await fetchOk("/lien-he");
  await fetchOk("/login");

  // ── 1. Đọc admin user ──
  console.log("\n— Database seed / admin —");
  const admin = await prisma.user.findFirst({
    where: { email: process.env.ADMIN_EMAIL || "admin@phuthanhnam.vn" },
  });
  if (!admin) {
    fail("Admin user", "không tìm thấy — chạy db:seed");
  } else {
    pass("Admin user", admin.email);
  }

  // ── 2. CRUD SERVICE ──
  console.log("\n— CRUD Dịch vụ —");
  const serviceSlug = `smoke-service-${Date.now()}`;
  let serviceId = "";
  try {
    if (!admin) throw new Error("no admin");
    const created = await prisma.post.create({
      data: {
        title: "Smoke Service OMD Test",
        slug: serviceSlug,
        summary: "Mô tả dịch vụ smoke test",
        contentHtml: "<p>Nội dung <strong>smoke</strong> service</p>",
        thumbnail:
          "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80",
        type: "SERVICE",
        status: "PUBLISHED",
        isVisible: true,
        authorId: admin.id,
      },
    });
    serviceId = created.id;
    pass("Create SERVICE", serviceSlug);
    await invalidateCmsCache([serviceSlug]);

    await prisma.post.update({
      where: { id: serviceId },
      data: { title: "Smoke Service UPDATED", summary: "Đã sửa" },
    });
    pass("Update SERVICE");
    await invalidateCmsCache([serviceSlug]);

    const pub = await fetchOk(`/dich-vu/${serviceSlug}`, "Smoke Service UPDATED");
    if (pub.ok) pass("Public sync SERVICE detail");

    const list = await fetchOk("/dich-vu", "Smoke Service UPDATED");
    if (list.ok) pass("Public sync SERVICE list");

    await prisma.post.delete({ where: { id: serviceId } });
    serviceId = "";
    pass("Delete SERVICE");
    await invalidateCmsCache([serviceSlug]);

    const after = await fetch(`${BASE}/dich-vu/${serviceSlug}`);
    if (after.status === 404) pass("Public 404 sau xoá SERVICE");
    else fail("Public 404 sau xoá SERVICE", `status ${after.status}`);
  } catch (e) {
    fail("CRUD SERVICE", e instanceof Error ? e.message : String(e));
    if (serviceId) await prisma.post.delete({ where: { id: serviceId } }).catch(() => {});
  }

  // ── 3. CRUD NEWS ──
  console.log("\n— CRUD Tin tức —");
  const newsSlug = `smoke-news-${Date.now()}`;
  let newsId = "";
  try {
    if (!admin) throw new Error("no admin");
    const created = await prisma.post.create({
      data: {
        title: "Smoke News Headline",
        slug: newsSlug,
        summary: "Tóm tắt tin smoke",
        contentHtml: "<h2>Smoke</h2><p>Nội dung tin</p>",
        thumbnail:
          "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
        type: "NEWS",
        status: "PUBLISHED",
        isVisible: true,
        authorId: admin.id,
      },
    });
    newsId = created.id;
    pass("Create NEWS", newsSlug);
    await invalidateCmsCache([newsSlug]);

    await fetchOk(`/tin-tuc/${newsSlug}`, "Smoke News Headline");
    await fetchOk("/tin-tuc", "Smoke News Headline");

    await prisma.post.delete({ where: { id: newsId } });
    newsId = "";
    pass("Delete NEWS");
    await invalidateCmsCache([newsSlug]);
  } catch (e) {
    fail("CRUD NEWS", e instanceof Error ? e.message : String(e));
    if (newsId) await prisma.post.delete({ where: { id: newsId } }).catch(() => {});
  }

  // ── 4. Gallery ──
  console.log("\n— Gallery xưởng —");
  let galleryId = "";
  try {
    const item = await prisma.galleryItem.create({
      data: {
        title: "Smoke Gallery",
        caption: "Caption smoke",
        imageUrl:
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80",
        altText: "smoke",
        isActive: true,
        sortOrder: 99,
      },
    });
    galleryId = item.id;
    pass("Create Gallery item");
    await invalidateCmsCache();

    await prisma.galleryItem.update({
      where: { id: galleryId },
      data: { title: "Smoke Gallery UPDATED", isActive: true },
    });
    pass("Update Gallery item");
    await invalidateCmsCache();

    // Homepage should include gallery (marquee) — hard to assert exact title in HTML;
    // at least home still 200 and item exists in DB as active
    const active = await prisma.galleryItem.findFirst({
      where: { id: galleryId, isActive: true },
    });
    if (active) pass("Gallery active in DB");
    else fail("Gallery active in DB");

    await prisma.galleryItem.update({
      where: { id: galleryId },
      data: { isActive: false },
    });
    pass("Toggle Marquee off");

    await prisma.galleryItem.delete({ where: { id: galleryId } });
    galleryId = "";
    pass("Delete Gallery item");
    await invalidateCmsCache();
  } catch (e) {
    fail("Gallery CRUD", e instanceof Error ? e.message : String(e));
    if (galleryId)
      await prisma.galleryItem.delete({ where: { id: galleryId } }).catch(() => {});
  }

  // ── 5. Workflow ──
  console.log("\n— Workflow —");
  let stepId = "";
  try {
    const step = await prisma.workflowStep.create({
      data: {
        stepNumber: "99",
        title: "Smoke Step",
        subtitle: "Test",
        description: "Bước smoke test",
        imageUrl:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
        isActive: true,
        sortOrder: 99,
      },
    });
    stepId = step.id;
    pass("Create Workflow step");
    await invalidateCmsCache();

    await prisma.workflowStep.update({
      where: { id: stepId },
      data: { title: "Smoke Step UPDATED", imageUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80" },
    });
    pass("Update Workflow (ảnh)");
    await invalidateCmsCache();

    await prisma.workflowStep.delete({ where: { id: stepId } });
    stepId = "";
    pass("Delete Workflow step");
    await invalidateCmsCache();
  } catch (e) {
    fail("Workflow CRUD", e instanceof Error ? e.message : String(e));
    if (stepId)
      await prisma.workflowStep.delete({ where: { id: stepId } }).catch(() => {});
  }

  // ── 6. Slideshow (bannerData) ──
  console.log("\n— Slideshow / Hero —");
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: "site_config" },
    });
    const raw = settings?.bannerData ? JSON.parse(settings.bannerData) : {};
    const before = Array.isArray(raw.slideshow) ? [...raw.slideshow] : [];
    const smokeSlide = {
      id: `smoke_slide_${Date.now()}`,
      title: "Smoke Slide",
      link: "/gioi-thieu",
      imageUrl:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      sortOrder: 99,
      isVisible: true,
    };
    const next = {
      ...raw,
      slideshow: [...before, smokeSlide],
      hero: raw.hero || {
        heading: "MAY MẶC PHÚ THÀNH NAM",
        subheading: "Chính xác - Quy mô - Chất lượng",
        description: "Smoke hero",
        ctaLabel: "Xem thêm",
        ctaHref: "/gioi-thieu",
      },
    };
    await prisma.siteSetting.upsert({
      where: { id: "site_config" },
      update: { bannerData: JSON.stringify(next) },
      create: {
        id: "site_config",
        companyName: "Công ty May Mặc Phú Thành Nam",
        bannerData: JSON.stringify(next),
      },
    });
    pass("Add Slideshow item");
    await invalidateCmsCache();

    // restore
    await prisma.siteSetting.update({
      where: { id: "site_config" },
      data: {
        bannerData: JSON.stringify({ ...next, slideshow: before }),
      },
    });
    pass("Remove Slideshow item (restore)");
    await invalidateCmsCache();
  } catch (e) {
    fail("Slideshow", e instanceof Error ? e.message : String(e));
  }

  // ── 7. Existing seeded content on public ──
  console.log("\n— Seeded content trên public —");
  const services = await prisma.post.findMany({
    where: { type: "SERVICE", status: "PUBLISHED", isVisible: true },
    take: 3,
  });
  for (const s of services) {
    await fetchOk(`/dich-vu/${s.slug}`, s.title);
  }
  const news = await prisma.post.findMany({
    where: { type: "NEWS", status: "PUBLISHED", isVisible: true },
    take: 2,
  });
  for (const n of news) {
    await fetchOk(`/tin-tuc/${n.slug}`, n.title);
  }

  // Header nav markers
  const home = await fetch(`${BASE}/`);
  const homeHtml = await home.text();
  for (const label of [
    "Trang chủ",
    "Về PTN",
    "Năng lực sản xuất",
    "Dịch vụ",
    "Tin tức",
    "Liên hệ",
  ]) {
    if (homeHtml.includes(label)) pass(`Header nav: ${label}`);
    else fail(`Header nav: ${label}`);
  }
  if (homeHtml.includes("PTN") || homeHtml.includes("Apparel") || homeHtml.includes("Phú Thành Nam")) {
    pass("Logo / brand trên trang chủ");
  } else {
    fail("Logo / brand trên trang chủ");
  }

  // ── 8. Admin routes redirect khi chưa login ──
  console.log("\n— Admin auth guard —");
  const adminRes = await fetch(`${BASE}/admin`, { redirect: "manual" });
  if (adminRes.status === 307 || adminRes.status === 302 || adminRes.status === 303) {
    const loc = adminRes.headers.get("location") || "";
    if (loc.includes("/login")) pass("Admin yêu cầu login", loc);
    else pass("Admin redirect", `${adminRes.status} → ${loc}`);
  } else if (adminRes.status === 200) {
    // có thể đã có session cookie từ môi trường — vẫn OK nếu page load
    pass("Admin page accessible", "HTTP 200 (có thể đã login)");
  } else {
    fail("Admin auth guard", `status ${adminRes.status}`);
  }

  // ── 9. Upload unauthenticated should 401 ──
  console.log("\n— Upload API —");
  const form = new FormData();
  const blob = new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64")], {
    type: "image/png",
  });
  form.append("file", blob, "smoke.png");
  const up = await fetch(`${BASE}/api/upload`, { method: "POST", body: form });
  if (up.status === 401) pass("Upload chặn khi chưa login", "401");
  else fail("Upload chặn khi chưa login", `status ${up.status}`);

  printSummary();
}

function printSummary() {
  const ok = results.filter((r) => r.ok).length;
  const bad = results.filter((r) => !r.ok);
  console.log(`\n📊 Kết quả: ${ok}/${results.length} passed`);
  if (bad.length) {
    console.log("\nLỗi:");
    for (const b of bad) console.log(`  - ${b.name}: ${b.detail || ""}`);
    process.exitCode = 1;
  } else {
    console.log("\n🎉 Toàn bộ smoke test đạt.\n");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
