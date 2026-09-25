import Link from "next/link";
import { trustFeatures } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ValuesSection() {
  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:gap-16 md:px-8">
        <div className="md:col-span-5">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Đối tác tin cậy của các thương hiệu thời trang toàn cầu
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink/65">
            Phú Thành Nam đồng hành cùng brand từ brief đến xuất xưởng — kiểm soát
            chất lượng, tiến độ và chi phí theo chuẩn xuất khẩu quốc tế.
          </p>

          <div className="mt-10 bg-ink px-6 py-7 text-paper md:px-8 md:py-8">
            <p className="font-display text-3xl font-bold md:text-4xl">
              Happy users 100%
            </p>
            <p className="mt-2 text-sm text-paper/65">
              Tỉ lệ hài lòng khách hàng
            </p>
          </div>

          <Link
            href="/gioi-thieu"
            className="mt-8 inline-flex text-sm font-semibold text-accent transition hover:text-accent-hover"
          >
            Tìm hiểu về PTN →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:col-span-7">
          {trustFeatures.map((item) => (
            <div
              key={item.title}
              className={cn(
                "flex flex-col justify-between p-6 md:p-7",
                item.featured
                  ? "bg-ink text-paper"
                  : "border border-[var(--line)] bg-paper",
              )}
            >
              <div>
                <h3
                  className={cn(
                    "font-display text-xl font-semibold",
                    item.featured ? "text-paper" : "text-ink",
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 text-sm leading-relaxed",
                    item.featured ? "text-paper/65" : "text-ink/60",
                  )}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
