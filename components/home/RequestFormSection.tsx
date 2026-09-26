"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function RequestFormSection({
  title = "Gửi yêu cầu cho chúng tôi",
  description = "Để lại thông tin — đội ngũ Phú Thành Nam sẽ liên hệ tư vấn OMD/CMT trong 24 giờ làm việc.",
}: {
  title?: string;
  description?: string;
}) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <section className="bg-brass py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:items-center md:gap-16 md:px-8">
        <div className="md:col-span-5">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink uppercase md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/70">
            {description}
          </p>
        </div>

        <div className="bg-paper p-6 shadow-sm md:col-span-7 md:p-8">
          {sent ? (
            <p className="py-8 text-center text-sm font-medium text-ink">
              Đã nhận yêu cầu. Chúng tôi sẽ liên hệ sớm.
            </p>
          ) : (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError("");
                try {
                  const form = new FormData(e.currentTarget);
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    body: form,
                  });
                  if (!res.ok) throw new Error("Gửi thất bại");
                  setSent(true);
                } catch {
                  setError("Không gửi được. Vui lòng thử lại.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Input required name="fullName" placeholder="Họ và tên" />
              <Input required name="phone" placeholder="Số điện thoại" />
              <Input required type="email" name="email" placeholder="Email" />
              <Textarea
                required
                name="message"
                rows={4}
                placeholder="Tin nhắn"
              />
              {error && <p className="text-sm text-accent">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-paper hover:bg-accent-hover"
              >
                {loading ? "Đang gửi…" : "Gửi thông tin"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
