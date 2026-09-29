"use client";

import { useState } from "react";
import { site } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

const serviceOptions = [
  "Gia công FOB",
  "Gia công CMT",
  "Đặt may mẫu",
  "Gia công đồng phục xuất khẩu",
];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-mist/40 p-8">
        <p className="font-display text-2xl font-semibold text-ink">
          Cảm ơn bạn đã liên hệ
        </p>
        <p className="mt-3 text-sm text-ink/65">
          Yêu cầu đã được ghi nhận trong hệ thống. Đội ngũ Phú Thành Nam sẽ phản
          hồi qua email và điện thoại trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-2xl border border-[var(--line)] bg-mist/30 p-6 md:p-8"
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
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || "Gửi thất bại");
          }
          setSent(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Gửi thất bại");
        } finally {
          setLoading(false);
        }
      }}
    >
      <h2 className="font-display text-2xl font-semibold text-ink">
        Form liên hệ chuyên ngành
      </h2>
      <p className="text-sm text-ink/60">
        Điền thông tin và đính kèm techpack để nhận báo giá chính xác.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Họ và tên *</Label>
          <Input required name="fullName" />
        </div>
        <div>
          <Label>Công ty / Thương hiệu</Label>
          <Input name="companyName" />
        </div>
        <div>
          <Label>Số điện thoại *</Label>
          <Input required name="phone" />
        </div>
        <div>
          <Label>Email *</Label>
          <Input required type="email" name="email" />
        </div>
      </div>

      <div>
        <Label>Dịch vụ quan tâm</Label>
        <Select name="serviceType" defaultValue="">
          <option value="" disabled>
            Chọn dịch vụ
          </option>
          {serviceOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Ngân sách dự kiến</Label>
        <Input name="budget" />
      </div>

      <div>
        <Label>Lời nhắn *</Label>
        <Textarea required name="message" rows={5} />
      </div>

      <div>
        <Label>Techpack / tài liệu (.pdf, .zip, .png, .jpg)</Label>
        <Input
          type="file"
          name="attachment"
          accept=".pdf,.zip,.png,.jpg,.jpeg"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="h-11 w-full rounded-full" disabled={loading}>
        {loading ? "Đang gửi…" : "Gửi liên hệ"}
      </Button>
    </form>
  );
}

export function ContactInfoCards({
  hotline,
  email,
  headOffice,
  factoryAddress,
  phone,
  workingHours,
}: {
  hotline?: string;
  email?: string;
  headOffice?: string;
  factoryAddress?: string;
  phone?: string;
  workingHours?: string;
}) {
  const cards = [
    { label: "Hotline", value: hotline || site.hotline },
    { label: "Điện thoại", value: phone },
    { label: "Email", value: email || site.email },
    { label: "Văn phòng", value: headOffice || site.headOffice },
    { label: "Nhà xưởng", value: factoryAddress || site.factoryAddress },
    { label: "Giờ làm việc", value: workingHours },
  ].filter((card) => card.value);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-[var(--line)] bg-paper p-5"
        >
          <p className="text-sm text-brass">
            {card.label}
          </p>
          <p className="mt-2 font-medium text-ink">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
