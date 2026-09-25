import { BentoMarqueeGrid } from "@/components/home/BentoMarqueeGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductLookbook } from "@/components/home/ProductLookbook";
import { RequestFormSection } from "@/components/home/RequestFormSection";
import { ServiceCards } from "@/components/home/ServiceCards";
import { StatsBar } from "@/components/home/StatsBar";
import { StickyWorkflow } from "@/components/home/StickyWorkflow";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ValuesSection } from "@/components/home/ValuesSection";
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

  return (
    <>
      <HeroSection
        slides={settings.slideshow}
        content={settings.hero}
      />
      <StatsBar />
      <ValuesSection />
      <ServiceCards
        items={servicePosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          subtitle: p.category,
          description: p.summary,
          image: p.thumbnail,
        }))}
      />
      <ProductLookbook />
      <BentoMarqueeGrid items={gallery} />
      <StickyWorkflow steps={workflow} />
      <TestimonialsSection />
      <RequestFormSection />
    </>
  );
}
