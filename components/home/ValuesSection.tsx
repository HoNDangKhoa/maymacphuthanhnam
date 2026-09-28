import { PillLink } from "@/components/common/PillLink";
import type { HomeTrustContent } from "@/lib/home-content";

export function ValuesSection({ content }: { content: HomeTrustContent }) {
  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:gap-16 md:px-8">
        <div className="md:col-span-5">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {content.heading}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink/65">
            {content.body}
          </p>

          <div className="mt-10 rounded-2xl bg-ink px-6 py-7 text-paper md:px-8 md:py-8">
            <p className="font-display text-3xl font-bold md:text-4xl">
              {content.happyUsersTitle}
            </p>
            <p className="mt-2 text-sm text-paper/65">
              {content.happyUsersSubtitle}
            </p>
          </div>

          <PillLink
            href={content.ctaHref || "/gioi-thieu"}
            variant="dark"
            className="mt-8"
          >
            {content.ctaLabel}
          </PillLink>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:col-span-7">
          {content.features.map((item, i) => (
            <div
              key={item.id}
              className="group flex min-h-56 flex-col justify-between rounded-2xl border border-[var(--line)] bg-paper p-6 transition duration-300 hover:border-transparent hover:bg-ink hover:text-paper md:p-7"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-ink transition group-hover:text-paper">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60 transition group-hover:text-paper/70">
                  {item.description}
                </p>
              </div>
              <span className="mt-8 self-end font-display text-3xl font-medium text-ink/15 tabular-nums transition group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
