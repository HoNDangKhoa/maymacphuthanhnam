# PROJECT EXECUTION PLAN: WEBSITE MAY MẶC PHÚ THÀNH NAM (PTN)

> **Mục tiêu:** Xây dựng website doanh nghiệp may mặc chuẩn quốc tế cho Phú Thành Nam với trải nghiệm UI/UX cao cấp, tích hợp các hiệu ứng cuộn hiện đại (Smooth Scroll, Sticky Stacking, Bento Marquee Grid), hệ thống bài viết chuyên sâu và trang quản trị nội dung (CMS Admin) toàn diện.
> **Công cụ thực thi chính:** Cursor IDE (Next.js 14/15 App Router, TypeScript, Tailwind CSS, Framer Motion, GSAP, Prisma ORM, PostgreSQL, shadcn/ui).

---

## 1. PHÂN TÍCH YÊU CẦU GIAO DIỆN & HIỆU ỨNG (UI/UX SPECIFICATION)

### 1.1. Trang chủ (Landing Page - Tham chiếu Figma Hình 1)
1. **Header / Navigation:** Logo PTN, menu điều hướng (Trang chủ, Về PTN, Năng lực sản xuất, Dịch vụ, Tin tức, Liên hệ), nút Call-To-Action "Yêu cầu báo giá" / chuyển đổi ngôn ngữ.
2. **Hero Section:** Banner công xưởng may quy mô, tiêu đề lớn *"MAY MẶC PHÚ THÀNH NAM - Chính xác, Quy mô, Chất lượng"*, khối counter thống kê ấn tượng (11+ năm kinh nghiệm, 10.000+ sản phẩm/ngày, 500+ nhân sự, 200+ đối tác).
3. **Đối tác tin cậy & Giá trị cốt lõi:** Lưới giá trị (Cam kết chất lượng, Phương châm phục vụ, Tối ưu chi phí, Fast Turnaround, Tỷ lệ giao hàng đúng hẹn 100%).
4. **Dịch vụ gia công:** Card dịch vụ nổi bật (OEM/ODM - Sản xuất theo thiết kế gốc, CMT - Cắt, May & Hoàn thiện).
5. **Dòng sản phẩm gia công:** Bộ lọc danh mục (Áo khoác, Blazer, Quần tây, Thời trang nữ...) hiển thị card lookbook rõ nét.
6. **Brand / Factory Bento Gallery (Hiệu ứng từ Hình 2 & Hình 3 - VMT Global):**
   * **Layout:** Lưới ảnh bất đối xứng (Bento Grid) kết hợp các ô ảnh bo góc (`rounded-2xl`).
   * **Hiệu ứng kỹ thuật:**
     * Infinite horizontal/floating marquee: Các dải ảnh trôi mượt mà ngược chiều nhau.
     * Hover effect: Tự động phóng to nhẹ (`scale-105`), hiển thị chú thích xưởng may/máy móc hiện đại.
     * Lightbox modal khi người dùng click vào xem chi tiết hình ảnh.
7. **Quy trình làm việc (Hiệu ứng từ Hình 4 & Hình 5 - Himon Framer):**
   * **Layout:** Nền tối (Dark tone) sang trọng. Chia 2 cột: Cột trái cố định tiêu đề lớn và bộ đếm bước (`01`, `02`, `03`...), cột phải là thẻ thông tin và hình ảnh minh họa cho từng công đoạn.
   * **Hiệu ứng kỹ thuật (Sticky Stacking Scroll):**
     * Sử dụng **GSAP ScrollTrigger** (`pin: true`) hoặc CSS `sticky top-24`.
     * Khi người dùng cuộn chuột, section sẽ khóa màn hình, cột bên phải sẽ trượt các thẻ card quy trình lên chồng lên nhau (stacking cards) hoặc tuần tự đổi số bước từ Tiếp nhận $\rightarrow$ Làm mẫu $\rightarrow$ Sản xuất số lượng lớn $\rightarrow$ KCS $\rightarrow$ Đóng gói xuất xưởng.
8. **Đánh giá từ đối tác & Form gửi yêu cầu báo giá:** Card testimonial uy tín, form nhập thông tin nhanh có đính kèm file Techpack.
9. **Footer:** Thông tin pháp lý, địa chỉ văn phòng, nhà xưởng, form nhận bản tin, liên kết mạng xã hội.

---

### 1.2. Mục PTN - Giới thiệu (`/gioi-thieu` - Cấu trúc newayhome.vn/gioi-thieu)
* **Cấu trúc:** Split layout 2 cột hiện đại:
  * **Cột trái (Sticky Sidebar - Table of Contents):** Mục lục neo (Lịch sử hình thành, Tầm nhìn & Sứ mệnh, Giá trị cốt lõi, Năng lực con người, Hệ thống chứng chỉ quốc tế ISO/WRAP/BSCI). Tự động highlight mục đang xem khi cuộn trang (Scrollspy).
  * **Cột phải (Nội dung chi tiết):** Bố cục tạp chí (Editorial layout) kết hợp văn bản chỉn chu, ảnh tư liệu phân giải cao, trích dẫn triết lý kinh doanh của ban lãnh đạo.

---

### 1.3. Mục Năng lực sản xuất & Tin tức (`/nang-luc-san-xuat`, `/tin-tuc` - Cấu trúc newayhome.vn/dich-vu)
* **Trang danh sách (`/tin-tuc`, `/nang-luc-san-xuat`):**
  * Danh mục filter ngang: "Tất cả", "Công nghệ dây chuyền", "Vải & Nguyên phụ liệu", "Xuất khẩu", "Tin thị trường".
  * Grid card 3 cột: Ảnh thumbnail tỷ lệ 16:9, badge danh mục, ngày xuất bản, tiêu đề in đậm, tóm tắt ngắn, nút "Xem chi tiết $\rightarrow$".
  * Phân trang chuẩn SEO hoặc Infinite Scroll.
* **Trang bài viết chi tiết (`/tin-tuc/[slug]`):**
  * Hỗ trợ Rich Content: Heading 2, Heading 3, ảnh đơn, chùm ảnh so sánh (Before/After), trích dẫn khối (Blockquote), bảng thông số kỹ thuật vải/sản phẩm.
  * Sidebar: Bài viết liên quan mới nhất, nút chia sẻ mạng xã hội, banner CTA gọi tư vấn nhanh.

---

### 1.4. Mục Liên hệ (`/lien-he` - Cấu trúc vmtglobal.com/lien-he)
* **Bản đồ tương tác:** Nhúng Google Maps định vị chính xác xưởng may và trụ sở công ty.
* **Khối thông tin liên hệ trực quan:** Thẻ Card chia rõ Hotline kinh doanh, Hotline kỹ thuật, Email nhận mẫu, Địa chỉ tiếp khách, Giờ làm việc.
* **Form liên hệ chuyên ngành may mặc:**
  * Trường nhập: Họ và tên, Công ty/Thương hiệu, Số điện thoại, Email, Dịch vụ quan tâm (Gia công FOB, Gia công CMT, Đặt may mẫu, Gia công đồng phục xuất khẩu), Ngân sách dự kiến, Lời nhắn.
  * Bộ tải lên file Techpack/Tài liệu kỹ thuật (`.pdf`, `.zip`, `.png`, `.jpg`).
  * Tích hợp gửi email xác nhận tức thời cho khách hàng và gửi thông báo vào email ban giám đốc.

---

## 2. KIẾN TRÚC HỆ THỐNG & CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

Dự án sử dụng **PostgreSQL** và **Prisma ORM** để quản lý dữ liệu linh hoạt, hỗ trợ cả bài viết động và cấu hình trực quan cho các section trang chủ.

```prisma:prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Quản lý Tài khoản Quản trị
model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  passwordHash String
  role         Role      @default(ADMIN)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  posts        Post[]
}

enum Role {
  SUPER_ADMIN
  ADMIN
  EDITOR
}

// 2. Quản lý Bài viết & Nội dung Trang
model Post {
  id              String      @id @default(cuid())
  title           String
  slug            String      @unique
  summary         String?     @db.Text
  contentHtml     String      @db.Text
  thumbnail       String?
  type            PostType    @default(NEWS)
  status          PostStatus  @default(DRAFT)
  views           Int         @default(0)
  metaTitle       String?
  metaDescription String?

  categoryId      String?
  category        Category?   @relation(fields: [categoryId], references: [id])
  authorId        String
  author          User        @relation(fields: [authorId], references: [id])

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([slug])
  @@index([type, status])
}

enum PostType {
  NEWS           // Tin tức thị trường / sự kiện
  CAPABILITY     // Năng lực sản xuất & máy móc
  ABOUT_SECTION  // Các bài viết cấu thành trang Giới thiệu (PTN)
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  type      PostType  @default(NEWS)
  posts     Post[]
  createdAt DateTime  @default(now())
}

// 3. Quản lý Quy trình sản xuất (Phần hiệu ứng Himon Framer)
model WorkflowStep {
  id          String   @id @default(cuid())
  stepNumber  String   // "01", "02", "03"...
  title       String
  subtitle    String?
  description String   @db.Text
  imageUrl    String
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

// 4. Quản lý Lưới ảnh Thư viện xưởng (Phần hiệu ứng VMT Global)
model GalleryItem {
  id          String   @id @default(cuid())
  title       String?
  caption     String?
  imageUrl    String
  altText     String?
  colSpan     Int      @default(1)
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

// 5. Quản lý Form Liên hệ & Yêu cầu báo giá
model ContactInquiry {
  id            String   @id @default(cuid())
  fullName      String
  companyName   String?
  email         String
  phone         String
  serviceType   String?  // FOB, CMT, Thiết kế mẫu...
  message       String   @db.Text
  attachmentUrl String?  // File tài liệu/Techpack
  status        InquiryStatus @default(NEW)
  notes         String?  @db.Text
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum InquiryStatus {
  NEW
  CONTACTED
  PROCESSING
  COMPLETED
  CANCELLED
}

// 6. Cấu hình Toàn trang (Site Settings)
model SiteSetting {
  id             String   @id @default("site_config")
  companyName    String   @default("Công ty May Mặc Phú Thành Nam")
  slogan         String?  @default("Chính xác - Quy mô - Chất lượng")
  hotline        String?
  email          String?
  headOffice     String?
  factoryAddress String?
  bannerData     Json?    // Chứa config slider/banner
  socialLinks    Json?    // Zalo, Facebook, LinkedIn...
  updatedAt      DateTime @updatedAt
}
```

---

## 3. THIẾT KẾ KIẾN TRÚC TRANG QUẢN TRỊ (ADMIN DASHBOARD)

Đường dẫn: `/admin` (Sử dụng `shadcn/ui` components, NextAuth.js bảo mật session).

### Các Module Quản trị chính:
1. **Tổng quan (Dashboard):**
   * Biểu đồ lượt tương tác và số lượng yêu cầu báo giá mới nhận được.
   * Danh sách 5 liên hệ mới nhất cần xử lý khẩn cấp.
2. **Quản lý Bài viết & Nội dung:**
   * **Mục Năng lực sản xuất:** Thêm/Sửa/Xóa các bài thuyết minh về dây chuyền, máy móc may tự động, phòng mẫu, hệ thống kiểm định chất lượng.
   * **Mục Tin tức:** Đăng tải tin hoạt động, xu hướng ngành may mặc, thông tin xuất khẩu.
   * **Trình soạn thảo văn bản (TipTap Editor):** Hỗ trợ kéo thả ảnh tải lên trực tiếp (lưu Cloudflare R2 / AWS S3 / Supabase Storage), nhúng video YouTube, tạo bảng và cấu hình thẻ SEO trực tiếp.
3. **Cấu hình Hiệu ứng Trang chủ (Dynamic Homepage Controls):**
   * **Bộ quản lý Workflow Steps:** Thêm/sửa số bước, tải ảnh công đoạn, thay đổi thứ tự kéo thả (Drag & Drop) để trang chủ tự render hiệu ứng Sticky Stacking tương ứng.
   * **Bộ quản lý Gallery Grid:** Quản lý kho ảnh xưởng may, cho phép gắn cờ hiển thị trên thanh trượt Marquee vô tận.
4. **Hộp thư Liên hệ & Báo giá (Lead CRM):**
   * Bảng hiển thị thông tin đối tác, nút tải tài liệu đính kèm/Techpack.
   * Cập nhật trạng thái xử lý (*Mới* $\rightarrow$ *Đã gọi điện* $\rightarrow$ *Đang làm mẫu* $\rightarrow$ *Thành công*).
   * Bộ lọc theo ngày tháng và chức năng xuất dữ liệu ra file Excel/CSV.
5. **Cấu hình Doanh nghiệp (Site Settings):**
   * Chỉnh sửa số Hotline xưởng, địa chỉ trụ sở, link Google Maps, thông tin SEO toàn trang (OpenGraph, Favicon).

---

## 4. CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT DIRECTORY STRUCTURE)

```bash
phu-thanh-nam-web/
├── app/
│   ├── (public)/                 # Layout công khai dành cho khách
│   │   ├── layout.tsx            # Header, Smooth Scroll (Lenis), Footer
│   │   ├── page.tsx              # Trang chủ (Figma + VMT + Himon effects)
│   │   ├── gioi-thieu/           # Trang Giới thiệu PTN (newayhome style)
│   │   │   └── page.tsx
│   │   ├── nang-luc-san-xuat/    # Trang Năng lực sản xuất
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── tin-tuc/              # Trang Tin tức
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── lien-he/              # Trang Liên hệ & Báo giá (vmtglobal style)
│   │       └── page.tsx
│   ├── (auth)/                   # Đăng nhập Admin
│   │   └── login/page.tsx
│   ├── admin/                    # Hệ thống CMS Quản trị
│   │   ├── layout.tsx            # Sidebar Navigation, Breadcrumb, User Profile
│   │   ├── page.tsx              # Dashboard thống kê
│   │   ├── posts/                # CRUD Tin tức & Năng lực sản xuất
│   │   ├── workflow/             # Quản lý các bước quy trình
│   │   ├── gallery/              # Quản lý kho ảnh Grid
│   │   ├── inquiries/            # Quản lý khách hàng liên hệ
│   │   └── settings/             # Cài đặt website
│   └── api/                      # Server Routes & Endpoints
│       ├── auth/[...nextauth]/route.ts
│       ├── contact/route.ts
│       ├── upload/route.ts
│       └── revalidate/route.ts
├── components/
│   ├── common/                   # Header, Footer, Logo, SectionTitle
│   ├── ui/                       # shadcn/ui components (Button, Dialog, Input, Table...)
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── ServiceCards.tsx
│   │   ├── BentoMarqueeGrid.tsx  # Hiệu ứng Lưới ảnh trôi (VMT Global style)
│   │   └── StickyWorkflow.tsx    # Hiệu ứng Quy trình cuộn xếp chồng (Himon style)
│   ├── about/
│   │   └── TocSidebar.tsx        # Menu mục lục cuộn trang (Neway style)
│   └── editor/
│       └── TipTapEditor.tsx      # Bộ soạn thảo rich text
├── lib/
│   ├── prisma.ts                 # Prisma Client Singleton
│   ├── utils.ts                  # Helper functions
│   └── validations.ts            # Zod validation schemas
├── prisma/
│   ├── schema.prisma             # Cơ sở dữ liệu
│   └── seed.ts                   # Dữ liệu khởi tạo mẫu
└── public/
    └── images/                   # Hình ảnh tĩnh và logo
```

---

## 5. LỘ TRÌNH THỰC THI CHO CURSOR (PROMPT ROADMAP)

*Dán các prompt bên dưới vào Cursor Composer (`Ctrl + I` hoặc `Cmd + I`) theo từng giai đoạn:*

### Giai đoạn 1: Khởi tạo và thiết lập Cơ sở dữ liệu
```text
Phase 1 Prompt for Cursor:
"Initialize the database setup for the project using Prisma with PostgreSQL.
Create the schema file based on the models in the plan: User, Post, Category, WorkflowStep, GalleryItem, ContactInquiry, SiteSetting.
Generate a seed script (prisma/seed.ts) with initial garment manufacturing data for Phu Thanh Nam (services: FOB, CMT, sample workflow steps 01-05, and demo gallery images).
Run the migration and verify the Prisma client connection."
```

### Giai đoạn 2: Xây dựng Giao diện Trang chủ & 2 Hiệu ứng đặc biệt
```text
Phase 2 Prompt for Cursor:
"Create the Homepage layout in app/(public)/page.tsx matching the Phu Thanh Nam Figma design:
1. Build HeroSection with bold typography and numerical stat counters.
2. Build BentoMarqueeGrid.tsx mimicking the VMT Global style: an asymmetrical grid of factory images with auto-scrolling marquee animation and hover zoom.
3. Build StickyWorkflow.tsx mimicking the Himon Framer style: dark background, fixed left title with step indicators (01, 02, 03...), and a sticky pin scroll effect on the right using GSAP ScrollTrigger or Framer Motion to stack the cards as the user scrolls.
4. Implement smooth scrolling across the entire site using @studio-freight/lenis."
```

### Giai đoạn 3: Xây dựng các Trang Chức năng theo mẫu
```text
Phase 3 Prompt for Cursor:
"Build the functional sub-pages:
1. app/(public)/gioi-thieu/page.tsx: Follow newayhome.vn/gioi-thieu with a sticky Table of Contents sidebar on the left that auto-highlights the active section, and a clean editorial layout on the right.
2. app/(public)/nang-luc-san-xuat and app/(public)/tin-tuc: Follow newayhome.vn/dich-vu with category filter tabs, modern 3-column article cards, and slug-based detail pages supporting rich text layout.
3. app/(public)/lien-he/page.tsx: Follow vmtglobal.com/lien-he with embedded map, company information cards, and a garment inquiry form supporting file upload for techpacks."
```

### Giai đoạn 4: Xây dựng Admin CMS Dashboard
```text
Phase 4 Prompt for Cursor:
"Implement the Admin Dashboard in app/admin:
1. Protect routes using NextAuth.js with credentials provider.
2. Build CRUD UI with shadcn/ui for Posts (supporting PostType for News vs Capabilities) using TipTap editor for rich content.
3. Create a dedicated management screen for WorkflowStep and GalleryItem so editors can reorder and toggle items appearing in the homepage animations.
4. Build the ContactInquiry inbox table with status badges and an action to mark inquiries as contacted or export data."
```