import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { getSiteSettings } from "@/lib/queries";

const companyLinks = [
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/gioi-thieu#lich-su", label: "Lịch sử" },
  { href: "/gioi-thieu#nhan-su", label: "Đội ngũ" },
  { href: "/nang-luc-san-xuat", label: "Năng lực sản xuất" },
];

const serviceLinks = [
  { href: "/dich-vu", label: "Sản xuất OMD" },
  { href: "/dich-vu", label: "Sản xuất CMT" },
  { href: "/lien-he", label: "Đặt may mẫu" },
  { href: "/tin-tuc", label: "Tin tức" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  if (settings.footer && settings.footer.isVisible === false) return null;

  const summary =
    settings.footer?.summary ||
    `${settings.fullName} — đối tác gia công may mặc OEM/ODM & CMT. ${settings.slogan}.`;
  const copyright =
    settings.footer?.copyright ||
    `© ${new Date().getFullYear()} ${settings.fullName}. Bảo lưu mọi quyền.`;

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="texture-grain absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pt-16 pb-10 sm:grid-cols-2 md:px-8 md:pt-20 lg:grid-cols-4 lg:gap-12">
        <div>
          <Logo light imageUrl={settings.logoUrl || undefined} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/65">
            {summary}
          </p>
          {settings.footer?.content ? (
            <p className="mt-3 max-w-sm whitespace-pre-line text-sm text-paper/55">
              {settings.footer.content}
            </p>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-semibold text-brass-bright">
            Về công ty
          </p>
          <ul className="mt-4 space-y-2.5">
            {companyLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-paper/70 transition hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-brass-bright">
            Dịch vụ
          </p>
          <ul className="mt-4 space-y-2.5">
            {serviceLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-paper/70 transition hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-brass-bright">
            Liên hệ
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-paper/70">
            <li>Hotline: {settings.hotline}</li>
            <li>Email: {settings.email}</li>
            <li>VP: {settings.headOffice}</li>
            <li>Xưởng: {settings.factoryAddress}</li>
          </ul>
        </div>
      </div>

      <div
        aria-hidden
        className="footer-wordmark relative overflow-hidden select-none"
      >
        <div className="marquee-track flex w-max">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="shrink-0 bg-gradient-to-b from-paper/20 via-paper/8 to-transparent bg-clip-text pr-[0.35em] font-display text-[22vw] leading-[0.82] font-bold tracking-[-0.04em] whitespace-nowrap text-transparent md:text-[15vw]"
            >
              Phú Thành Nam
            </span>
          ))}
        </div>
      </div>

      <div className="relative border-t border-paper/10 px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          <p className="flex flex-wrap gap-4">
            {(settings.socialFooter?.length
              ? settings.socialFooter
              : [
                  { id: "fb", title: "Facebook", link: settings.social?.facebook || "#" },
                  { id: "li", title: "LinkedIn", link: settings.social?.linkedin || "#" },
                  { id: "zl", title: "Zalo", link: settings.social?.zalo || "#" },
                ]
            ).map((item) => (
              <a
                key={item.id}
                href={item.link || "#"}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-paper"
              >
                {item.title}
              </a>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
