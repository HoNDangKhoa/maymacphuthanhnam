import type { Metadata } from "next";
import Script from "next/script";
import { CustomScripts } from "@/components/common/CustomScripts";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { VisitTracker } from "@/components/common/VisitTracker";
import { categoryHref, categoryInfoOf } from "@/lib/home-content";
import { getSiteSettings } from "@/lib/queries";
import { parseAnalytics, parseVerification } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const verification = parseVerification(settings.googleWebmaster);
  const keywords = (settings.seoKeywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  return {
    title: settings.metaTitle || undefined,
    description: settings.metaDescription || undefined,
    keywords: keywords.length ? keywords : undefined,
    verification: verification ? { google: verification } : undefined,
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
  const catalog = settings.homeLookbook;
  const productMenu = catalog.categories.map((key) => {
    const info = categoryInfoOf(catalog, key);
    return {
      href: categoryHref(key),
      label: info.name,
      description: info.description,
    };
  });
  const analytics = parseAnalytics(settings.googleAnalytics);

  return (
    <SmoothScroll>
      {analytics.id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics.id}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analytics.id}');`}
          </Script>
        </>
      )}
      <CustomScripts
        target="head"
        html={[analytics.html, settings.headJs || ""].join("\n")}
      />
      <CustomScripts target="body" html={settings.bodyJs || ""} />
      <VisitTracker />
      <Header
        logoUrl={settings.logoUrl || undefined}
        productMenu={productMenu}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
