import {
  BarChart3,
  FileText,
  FolderOpen,
  ImageIcon,
  Search,
  Settings,
  Mail,
  LayoutTemplate,
  Newspaper,
  Factory,
  Briefcase,
  Tags,
  Quote,
  ListOrdered,
  Users,
  Footprints,
  Info,
  Images,
  Share2,
  Film,
  KeyRound,
  UserRound,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href?: string;
  icon?: string;
  children?: { label: string; href: string }[];
};

export const adminNav: AdminNavItem[] = [
  {
    label: "Bảng điều khiển",
    href: "/admin",
    icon: "dashboard",
  },
  {
    label: "Quản lý bài viết",
    icon: "posts",
    children: [
      { label: "Tin tức", href: "/admin/content/news" },
      { label: "Năng lực sản xuất", href: "/admin/content/capabilities" },
      { label: "Dịch vụ", href: "/admin/content/services" },
      { label: "Danh mục", href: "/admin/categories" },
    ],
  },
  {
    label: "Quản lý trang tĩnh",
    icon: "home",
    children: [
      { label: "Slogan / Hero", href: "/admin/home/hero" },
      { label: "Giá trị cốt lõi", href: "/admin/home/trust" },
      { label: "Số liệu thống kê", href: "/admin/home/stats" },
      { label: "Quy trình làm việc", href: "/admin/home/workflow" },
      { label: "Đánh giá khách hàng", href: "/admin/home/testimonials" },
      { label: "Giới thiệu", href: "/admin/static/about" },
      { label: "Footer", href: "/admin/static/footer" },
    ],
  },
  {
    label: "Quản lý hình ảnh - video",
    icon: "media",
    children: [
      { label: "Logo", href: "/admin/branding/logo" },
      { label: "Video mp4", href: "/admin/branding/video" },
      { label: "Favicon", href: "/admin/branding/favicon" },
      { label: "Slideshow", href: "/admin/branding/slideshow" },
      { label: "Gallery xưởng", href: "/admin/branding/gallery" },
      { label: "Mạng xã hội Footer", href: "/admin/branding/social" },
      { label: "Thư viện media", href: "/admin/media" },
    ],
  },
  {
    label: "Quản lý SEO page",
    icon: "seo",
    children: [
      { label: "Tin tức", href: "/admin/seo/news" },
      { label: "Năng lực sản xuất", href: "/admin/seo/capability" },
      { label: "Dịch vụ", href: "/admin/seo/service" },
    ],
  },
  {
    label: "Thiết lập thông tin",
    href: "/admin/settings",
    icon: "settings",
  },
  {
    label: "Thư liên hệ",
    href: "/admin/contacts",
    icon: "contacts",
  },
];

export const adminIconMap = {
  dashboard: BarChart3,
  posts: FileText,
  home: LayoutTemplate,
  media: ImageIcon,
  seo: Search,
  settings: Settings,
  contacts: Mail,
  news: Newspaper,
  capability: Factory,
  service: Briefcase,
  category: Tags,
  testimonial: Quote,
  workflow: ListOrdered,
  about: Info,
  footer: Footprints,
  gallery: Images,
  social: Share2,
  video: Film,
  account: UserRound,
  password: KeyRound,
  folder: FolderOpen,
  users: Users,
} as const;
