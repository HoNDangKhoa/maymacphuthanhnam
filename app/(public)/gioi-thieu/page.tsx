import type { Metadata } from "next";
import { TocSidebar } from "@/components/about/TocSidebar";
import { aboutSections, site } from "@/lib/data";

export const metadata: Metadata = {
  title: "Về Phú Thành Nam",
  description: `Giới thiệu ${site.fullName} — lịch sử, tầm nhìn, giá trị và chứng chỉ.`,
};

export default function AboutPage() {
  return (
    <div className="bg-paper pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.22em] text-brass uppercase">
          Về PTN
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl lg:text-6xl">
          May Mặc Phú Thành Nam
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">
          {site.slogan}. Doanh nghiệp gia công may mặc định hướng chuẩn quốc tế —
          chính xác trong form, quy mô trong sản xuất, chất lượng trong từng lô
          hàng.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <TocSidebar />
          </aside>

          <div className="space-y-20 lg:col-span-9">
            {aboutSections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32"
              >
                <p className="font-display text-sm text-brass">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                  {section.title}
                </h2>
                <p className="mt-6 max-w-3xl text-base leading-[1.8] text-ink/70 md:text-lg">
                  {section.content}
                </p>
                {i === 0 && (
                  <blockquote className="mt-10 border-l-2 border-brass pl-6">
                    <p className="font-display text-xl leading-relaxed text-ink md:text-2xl">
                      “Mỗi đơn hàng là một lời cam kết — chính xác, đúng hạn, đủ
                      chuẩn xuất khẩu.”
                    </p>
                    <cite className="mt-4 block text-sm text-ink/50 not-italic">
                      — Ban lãnh đạo Phú Thành Nam
                    </cite>
                  </blockquote>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
