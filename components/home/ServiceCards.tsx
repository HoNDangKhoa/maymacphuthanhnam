import { SectionEyebrow } from "@/components/common/SectionEyebrow";
import Image from "next/image";
import { PillLink } from "@/components/common/PillLink";
import { services as fallbackServices } from "@/lib/data";

export type ServiceCardItem = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

export function ServiceCards({
  items,
  eyebrow = "Dịch vụ",
  title = "Dịch vụ của chúng tôi",
}: {
  items?: ServiceCardItem[];
  eyebrow?: string;
  title?: string;
}) {
  const list = items?.length ? items : fallbackServices;

  return (
    <section id="dich-vu" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl lg:text-5xl">
          {title}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {list.map((service) => (
            <article
              key={service.slug}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist md:aspect-[16/11]"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition duration-[1400ms] ease-out group-hover:scale-105"
                sizes="(max-width:768px) 100vw, 50vw"
              />
              {/* Default: light bottom fade — full dark only on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-ink/0 transition duration-1000 ease-in-out group-hover:bg-ink/75" />
              <div className="service-card-content absolute inset-0 p-6 md:p-8">
                <div className="flex flex-col items-start [grid-area:2/2]">
                  <h3 className="font-display text-2xl font-bold text-paper md:text-3xl">
                    {service.title}
                    {service.subtitle ? ` - ${service.subtitle}` : ""}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-paper/75 opacity-90 transition duration-1000 group-hover:opacity-100">
                    {service.description}
                  </p>
                  <PillLink href={`/dich-vu/${service.slug}`} className="mt-5">
                    Xem thêm
                  </PillLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
