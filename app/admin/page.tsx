import { Suspense } from "react";
import Link from "next/link";
import { Gauge } from "lucide-react";
import {
  DashboardAnalyticsPanel,
  QuickLinkCards,
} from "@/components/admin/DashboardAnalytics";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { Badge } from "@/components/ui/input";
import {
  getDashboardAnalytics,
  seedDemoVisitsIfEmpty,
} from "@/lib/analytics";
import { INQUIRY_STATUS_LABEL } from "@/lib/cms";
import { prisma } from "@/lib/prisma";

type Props = { searchParams: Promise<{ month?: string; year?: string }> };

export default async function AdminDashboardPage({ searchParams }: Props) {
  const sp = await searchParams;
  const month = Number(sp.month) || undefined;
  const year = Number(sp.year) || undefined;

  await seedDemoVisitsIfEmpty();

  const [analytics, latest] = await Promise.all([
    getDashboardAnalytics(month, year),
    prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Bảng điều khiển"
        icon={<Gauge size={20} />}
      />

      <QuickLinkCards />

      <Suspense
        fallback={
          <div className="rounded-2xl border border-black/8 bg-white p-8 text-sm text-ink/50">
            Đang tải thống kê…
          </div>
        }
      >
        <DashboardAnalyticsPanel initial={analytics} />
      </Suspense>

      <AdminCard title="Thư liên hệ gần đây">
        <div className="mb-3 flex justify-end">
          <Link
            href="/admin/contacts"
            className="text-sm font-semibold text-[#f59e0b]"
          >
            Xem tất cả
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="text-sm text-ink/50">
            Chưa có thư liên hệ.
          </p>
        ) : (
          <ul className="divide-y divide-black/5">
            {latest.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">{row.fullName}</p>
                  <p className="text-xs font-semibold text-ink/45">
                    {row.companyName || row.email}
                  </p>
                </div>
                <Badge
                  tone={
                    row.status === "NEW"
                      ? "warn"
                      : row.status === "COMPLETED"
                        ? "success"
                        : "info"
                  }
                >
                  {INQUIRY_STATUS_LABEL[row.status] || row.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
