import { BentoMarqueeGrid } from "@/components/home/BentoMarqueeGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductLookbook } from "@/components/home/ProductLookbook";
import { RequestFormSection } from "@/components/home/RequestFormSection";
import { ServiceCards } from "@/components/home/ServiceCards";
import { StatsBar } from "@/components/home/StatsBar";
import { StickyWorkflow } from "@/components/home/StickyWorkflow";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ValuesSection } from "@/components/home/ValuesSection";
import { visibleProducts } from "@/lib/home-content";
import {
  getActiveGallery,
  getActiveWorkflow,
  getPublishedPosts,
  getSiteSettings,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [workflow, gallery, settings, servicePosts] = await Promise.all([
    getActiveWorkflow(),
    getActiveGallery(),
    getSiteSettings(),
    getPublishedPosts("SERVICE"),
  ]);

  const chrome = settings.homeChrome;

  return (
    <>
      <HeroSection
        slides={settings.slideshow}
        videoUrl={settings.heroVideoUrl}
        content={settings.hero}
      />
      <StatsBar items={settings.homeStats} />
      <ValuesSection content={settings.homeTrust} />
      <ServiceCards
        eyebrow={chrome.servicesEyebrow}
        title={chrome.servicesTitle}
        items={servicePosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          subtitle: p.category,
          description: p.summary,
          image: p.thumbnail,
        }))}
      />
      <ProductLookbook
        content={{
          ...settings.homeLookbook,
          products: visibleProducts(settings.homeLookbook.products),
        }}
      />
      <BentoMarqueeGrid
        items={gallery}
        eyebrow={chrome.galleryEyebrow}
        title={chrome.galleryTitle}
        description={chrome.galleryDescription}
      />
      <StickyWorkflow
        steps={workflow}
        eyebrow={chrome.workflowEyebrow}
        title={chrome.workflowTitle}
        description={chrome.workflowDescription}
      />
      <TestimonialsSection content={settings.homeTestimonials} />
      <RequestFormSection
        title={chrome.requestTitle}
        description={chrome.requestDescription}
      />
    </>
  );
}
