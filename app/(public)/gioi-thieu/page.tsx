import type { Metadata } from "next";
import { TocSidebar } from "@/components/about/TocSidebar";
import { getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Về Phú Thành Nam",
    description: `Giới thiệu ${settings.fullName} — lịch sử, tầm nhìn, giá trị và chứng chỉ.`,
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const aboutSections = settings.aboutSections;

  return (
    <div className="bg-paper pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-base font-semibold text-brass md:text-lg">
          Về PTN
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl lg:text-6xl">
          May Mặc Phú Thành Nam
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">
          {settings.slogan}. Doanh nghiệp gia công may mặc định hướng chuẩn quốc
          tế — chính xác trong form, quy mô trong sản xuất, chất lượng trong từng
          lô hàng.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <TocSidebar sections={aboutSections} />
          </aside>

          <div className="space-y-20 lg:col-span-9">
            {aboutSections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32"
              >
                <p className="font-display text-sm font-semibold text-brass">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                  {section.title}
                </h2>
                <div className="prose-ptn mt-6 max-w-none">
                  <p className="font-display text-xl leading-relaxed text-ink md:text-2xl">
                    {section.content}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
