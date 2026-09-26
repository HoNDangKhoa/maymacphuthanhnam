import Image from "next/image";
import Link from "next/link";
import { services as fallbackServices } from "@/lib/data";

export type ServiceCardItem = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

export function ServiceCards({ items }: { items?: ServiceCardItem[] }) {
  const list = items?.length ? items : fallbackServices;

  return (
    <section id="dich-vu" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
          Dịch vụ
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl lg:text-5xl">
          Dịch vụ của chúng tôi
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {list.map((service) => (
            <article
              key={service.slug}
              className="group relative aspect-[4/3] overflow-hidden bg-mist md:aspect-[16/11]"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width:768px) 100vw, 50vw"
              />
              {/* Default: light bottom fade — full dark only on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-ink/0 transition duration-500 group-hover:bg-ink/75" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 transition duration-500 group-hover:inset-0 group-hover:items-center group-hover:justify-center group-hover:text-center md:p-8">
                <h3 className="font-display text-2xl font-bold text-paper md:text-3xl">
                  {service.title}
                  {service.subtitle ? ` - ${service.subtitle}` : ""}
                </h3>
                <p className="mt-2 max-w-md text-sm text-paper/75 opacity-90 transition group-hover:opacity-100">
                  {service.description}
                </p>
                <Link
                  href={`/dich-vu/${service.slug}`}
                  className="mt-5 inline-flex bg-accent px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-accent-hover"
                >
                  Xem thêm
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
