"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { saveHeroContent } from "@/lib/actions";
import type { HeroContent } from "@/lib/branding";

export function HeroContentForm({ initial }: { initial: HeroContent }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <AdminPageHeader title="Slogan / Hero" />
      <p className="mb-5 text-sm text-ink/55">
        Tiêu đề lớn, phụ đề và mô tả khu vực hero trang chủ. Ảnh nền lấy từ
        Slideshow (Quản lý hình ảnh → Slideshow).
      </p>
      <AdminCard>
        <form
          className="max-w-2xl space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            startTransition(async () => {
              setMessage("");
              await saveHeroContent(form);
              setMessage("Đã lưu hero.");
              router.refresh();
            });
          }}
        >
          <div>
            <Label>Tiêu đề</Label>
            <Input
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
            />
          </div>
          <div>
            <Label>Phụ đề</Label>
            <Input
              value={form.subheading}
              onChange={(e) =>
                setForm({ ...form, subheading: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Mô tả</Label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nhãn nút CTA</Label>
              <Input
                value={form.ctaLabel}
                onChange={(e) =>
                  setForm({ ...form, ctaLabel: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Link CTA</Label>
              <Input
                value={form.ctaHref}
                onChange={(e) =>
                  setForm({ ...form, ctaHref: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              disabled={pending}
              className="bg-[#f59e0b] hover:bg-[#d97706]"
            >
              {pending ? "Đang lưu…" : "Lưu thay đổi"}
            </Button>
            {message && (
              <span className="text-sm font-semibold text-emerald-600">
                {message}
              </span>
            )}
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
