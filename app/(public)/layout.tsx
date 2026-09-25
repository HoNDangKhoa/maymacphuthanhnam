import type { Metadata } from "next";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { VisitTracker } from "@/components/common/VisitTracker";
import { getSiteSettings } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.metaTitle || undefined,
    description: settings.metaDescription || undefined,
    icons: settings.faviconUrl
      ? { icon: settings.faviconUrl }
      : undefined,
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <SmoothScroll>
      <VisitTracker />
      <Header logoUrl={settings.logoUrl || undefined} />
      <main className="flex-1">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
