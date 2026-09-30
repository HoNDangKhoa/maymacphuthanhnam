import { HtmlContent } from "@/components/common/HtmlContent";
import type { AboutArticle } from "@/lib/home-content";
import { isCustomLayout, toRichHtml } from "@/lib/rich-text";

export function PageArticleView({
  article,
  eyebrow,
  fallbackTitle,
  intro,
}: {
  article: AboutArticle;
  eyebrow: string;
  fallbackTitle: string;
  intro: string;
}) {
  const content = toRichHtml(article.content);

  if (isCustomLayout(content)) {
    return (
      <div className="bg-paper pt-[4.5rem] md:pt-[5.5rem]">
        <HtmlContent html={content} className="cms-layout" />
      </div>
    );
  }

  const title = article.title || fallbackTitle;

  return (
    <div className="bg-paper pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <p className="text-base font-semibold text-brass md:text-lg">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">
            {intro}
          </p>
        )}

        {article.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imageUrl}
            alt={title}
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
