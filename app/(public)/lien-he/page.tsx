import type { Metadata } from "next";
import {
  ContactForm,
  ContactInfoCards,
} from "@/components/contact/ContactForm";
import { getSiteSettings } from "@/lib/queries";
import { resolveMapEmbed } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ Phú Thành Nam — báo giá OEM/ODM, CMT, đặt may mẫu.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-paper pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-base font-semibold text-brass md:text-lg">
          Liên hệ
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Kết nối với Phú Thành Nam
        </h1>
        <p className="mt-5 max-w-2xl text-base text-ink/65 md:text-lg">
          Bản đồ xưởng, thông tin liên hệ và form gửi yêu cầu kèm techpack.
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border border-[var(--line)]">
          <iframe
            title="Bản đồ Phú Thành Nam"
            src={resolveMapEmbed(settings.mapsEmbedUrl)}
            className="h-72 w-full md:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-12">
          <ContactInfoCards
            hotline={settings.hotline}
            email={settings.email}
            headOffice={settings.headOffice}
            factoryAddress={settings.factoryAddress}
            phone={settings.phone}
            workingHours={settings.workingHours}
          />
        </div>

        <div className="mt-12 max-w-3xl">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
