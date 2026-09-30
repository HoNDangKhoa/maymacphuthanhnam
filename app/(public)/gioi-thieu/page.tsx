import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries";
import { HtmlContent } from "@/components/common/HtmlContent";
import { isCustomLayout, toRichHtml } from "@/lib/rich-text";

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
  const article = settings.aboutArticle;
  const content = toRichHtml(article.content);

  if (isCustomLayout(content)) {
    return (
      <div className="bg-paper pt-[4.5rem] md:pt-[5.5rem]">
        <HtmlContent html={content} className="cms-layout" />
      </div>
    );
  }

  return (
    <div className="bg-paper pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <p className="text-base font-semibold text-brass md:text-lg">
          Về PTN
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl lg:text-6xl">
          {article.title || "May Mặc Phú Thành Nam"}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">
          {settings.slogan}. Doanh nghiệp gia công may mặc định hướng chuẩn quốc
          tế — chính xác trong form, quy mô trong sản xuất, chất lượng trong từng
          lô hàng.
        </p>

        {article.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imageUrl}
            alt={article.title || "Giới thiệu Phú Thành Nam"}
            className="mt-12 w-full rounded-2xl object-cover"
          />
        )}

        {content && (
          <HtmlContent
            as="article"
            html={content}
            className="prose-ptn mt-12 max-w-none text-lg md:text-xl"
          />
        )}
      </div>
    </div>
  );
}
