"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { ImageDropzone } from "@/components/admin/BrandAssetForm";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  saveAboutSections,
  saveHomeChrome,
  saveHomeLookbook,
  saveHomeStats,
  saveHomeTestimonials,
  saveHomeTrust,
} from "@/lib/actions";
import type {
  AboutSectionItem,
  HomeLookbookContent,
  HomeSectionChrome,
  HomeStatItem,
  HomeTestimonialsContent,
  HomeTrustContent,
} from "@/lib/home-content";
import {
  STAT_ICON_OPTIONS,
  defaultStatIcon,
  newAboutSection,
  newHomeStat,
  newLookbookProduct,
  newTestimonial,
  newTrustFeature,
  type StatIconKey,
} from "@/lib/home-content";
import {
  Award,
  Clock,
  Factory,
  Globe,
  Handshake,
  Package,
  Scissors,
  Shield,
  Shirt,
  Star,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

const STAT_ICONS: Record<StatIconKey, LucideIcon> = {
  award: Award,
  package: Package,
  handshake: Handshake,
  users: Users,
  factory: Factory,
  shirt: Shirt,
  scissors: Scissors,
  truck: Truck,
  globe: Globe,
  star: Star,
  clock: Clock,
  shield: Shield,
};

function SaveBar({
  pending,
  message,
}: {
  pending: boolean;
  message: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <Button
        type="submit"
        disabled={pending}
        className="bg-[#f59e0b] hover:bg-[#d97706]"
      >
        {pending ? "Đang lưu…" : "Lưu thay đổi"}
      </Button>
      {message && (
        <span className="text-sm font-semibold text-emerald-600">{message}</span>
      )}
    </div>
  );
}

export function StatsEditor({ initial }: { initial: HomeStatItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <AdminPageHeader title="Số liệu thống kê" />
      <p className="mb-5 text-sm text-ink/55">
        Thanh số liệu dưới hero trang chủ (icon + số + nhãn + mô tả ngắn).
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            setMessage("");
            await saveHomeStats(items);
            setMessage("Đã lưu số liệu.");
            router.refresh();
          });
        }}
      >
        <SaveBar pending={pending} message={message} />
        <div className="space-y-4">
          {items.map((item, index) => (
            <AdminCard key={item.id} title={`Mục ${index + 1}`}>
              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <Label>Giá trị số</Label>
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = {
                        ...item,
                        value: Number(e.target.value) || 0,
                      };
                      setItems(next);
                    }}
                  />
                </div>
                <div>
                  <Label>Hậu tố</Label>
                  <Input
                    value={item.suffix}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...item, suffix: e.target.value };
                      setItems(next);
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Nhãn</Label>
                  <Input
                    value={item.label}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...item, label: e.target.value };
                      setItems(next);
                    }}
                  />
                </div>
              </div>
              <div className="mt-3">
                <Label>Mô tả ngắn</Label>
                <Input
                  value={item.caption}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...item, caption: e.target.value };
                    setItems(next);
                  }}
                />
              </div>

              <div className="mt-4">
                <Label>Icon</Label>
                <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-12">
                  {STAT_ICON_OPTIONS.map((opt) => {
                    const Icon = STAT_ICONS[opt.key];
                    const selected =
                      !item.iconUrl &&
                      (item.icon ?? defaultStatIcon(index)) === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        title={opt.label}
                        aria-label={opt.label}
                        aria-pressed={selected}
                        onClick={() => {
                          const next = [...items];
                          next[index] = { ...item, icon: opt.key, iconUrl: "" };
                          setItems(next);
                        }}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                          selected
                            ? "border-accent bg-accent/15 text-accent"
                            : "border-black/10 bg-white text-ink/60 hover:border-accent/50 hover:text-accent"
                        }`}
                      >
                        <Icon size={20} strokeWidth={2.25} />
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <Label>Hoặc tải icon riêng (png/svg, ưu tiên hơn icon chọn sẵn)</Label>
                  <ImageDropzone
                    value={item.iconUrl ?? ""}
                    onChange={(url) => {
                      const next = [...items];
                      next[index] = { ...item, iconUrl: url };
                      setItems(next);
                    }}
                    hint="Khuyến nghị: 48×48 px, nền trong suốt (png, svg)"
                  />
                </div>
              </div>

              <button
                type="button"
                className="mt-3 text-xs font-semibold text-red-600"
                onClick={() => setItems(items.filter((x) => x.id !== item.id))}
              >
                Xóa mục
              </button>
            </AdminCard>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => setItems([...items, newHomeStat()])}
        >
          + Thêm số liệu
        </Button>
      </form>
    </div>
  );
}

export function TrustEditor({ initial }: { initial: HomeTrustContent }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <AdminPageHeader title="Giá trị cốt lõi / Đối tác tin cậy" />
      <p className="mb-5 text-sm text-ink/55">
        Khối đối tác tin cậy + 4 thẻ hover đen trên trang chủ.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            setMessage("");
            await saveHomeTrust(form);
            setMessage("Đã lưu nội dung trust.");
            router.refresh();
          });
        }}
      >
        <SaveBar pending={pending} message={message} />
        <AdminCard title="Cột trái">
          <div className="space-y-3">
            <div>
              <Label>Tiêu đề</Label>
              <Textarea
                rows={2}
                value={form.heading}
                onChange={(e) => setForm({ ...form, heading: e.target.value })}
              />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea
                rows={3}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label>Happy users (dòng 1)</Label>
                <Input
                  value={form.happyUsersTitle}
                  onChange={(e) =>
                    setForm({ ...form, happyUsersTitle: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Happy users (dòng 2)</Label>
                <Input
                  value={form.happyUsersSubtitle}
                  onChange={(e) =>
                    setForm({ ...form, happyUsersSubtitle: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label>Nhãn CTA</Label>
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
          </div>
        </AdminCard>

        <div className="mt-4 space-y-4">
          {form.features.map((feature, index) => (
            <AdminCard key={feature.id} title={`Thẻ ${index + 1}`}>
              <div className="space-y-3">
                <div>
                  <Label>Tiêu đề thẻ</Label>
                  <Input
                    value={feature.title}
                    onChange={(e) => {
                      const features = [...form.features];
                      features[index] = {
                        ...feature,
                        title: e.target.value,
                      };
                      setForm({ ...form, features });
                    }}
                  />
                </div>
                <div>
                  <Label>Mô tả</Label>
                  <Textarea
                    rows={3}
                    value={feature.description}
                    onChange={(e) => {
                      const features = [...form.features];
                      features[index] = {
                        ...feature,
                        description: e.target.value,
                      };
                      setForm({ ...form, features });
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-red-600"
                  onClick={() =>
                    setForm({
                      ...form,
                      features: form.features.filter((f) => f.id !== feature.id),
                    })
                  }
                >
                  Xóa thẻ
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() =>
            setForm({
              ...form,
              features: [...form.features, newTrustFeature()],
            })
          }
        >
          + Thêm thẻ
        </Button>
      </form>
    </div>
  );
}

export function TestimonialsEditor({
  initial,
}: {
  initial: HomeTestimonialsContent;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <AdminPageHeader title="Đánh giá khách hàng" />
      <p className="mb-5 text-sm text-ink/55">
        Tiêu đề section + danh sách đánh giá (hover đen trên trang chủ).
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            setMessage("");
            await saveHomeTestimonials(form);
            setMessage("Đã lưu đánh giá.");
            router.refresh();
          });
        }}
      >
        <SaveBar pending={pending} message={message} />
        <AdminCard title="Tiêu đề section">
          <div className="space-y-3">
            <div>
              <Label>Eyebrow</Label>
              <Input
                value={form.eyebrow}
                onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
              />
            </div>
            <div>
              <Label>Tiêu đề</Label>
              <Input
                value={form.heading}
                onChange={(e) => setForm({ ...form, heading: e.target.value })}
              />
            </div>
            <div>
              <Label>Mô tả ngắn</Label>
              <Textarea
                rows={2}
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </div>
          </div>
        </AdminCard>

        <div className="mt-4 space-y-4">
          {form.items.map((item, index) => (
            <AdminCard key={item.id} title={`Đánh giá ${index + 1}`}>
              <div className="space-y-3">
                <div>
                  <Label>Nội dung</Label>
                  <Textarea
                    rows={4}
                    value={item.quote}
                    onChange={(e) => {
                      const items = [...form.items];
                      items[index] = { ...item, quote: e.target.value };
                      setForm({ ...form, items });
                    }}
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <Label>Tên</Label>
                    <Input
                      value={item.author}
                      onChange={(e) => {
                        const items = [...form.items];
                        items[index] = { ...item, author: e.target.value };
                        setForm({ ...form, items });
                      }}
                    />
                  </div>
                  <div>
                    <Label>Chức danh</Label>
                    <Input
                      value={item.role}
                      onChange={(e) => {
                        const items = [...form.items];
                        items[index] = { ...item, role: e.target.value };
                        setForm({ ...form, items });
                      }}
                    />
                  </div>
                  <div>
                    <Label>Viết tắt avatar</Label>
                    <Input
                      value={item.initials}
                      onChange={(e) => {
                        const items = [...form.items];
                        items[index] = { ...item, initials: e.target.value };
                        setForm({ ...form, items });
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Màu avatar</Label>
                  <select
                    className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold"
                    value={item.avatarTone}
                    onChange={(e) => {
                      const items = [...form.items];
                      items[index] = {
                        ...item,
                        avatarTone: e.target.value as "ink" | "accent",
                      };
                      setForm({ ...form, items });
                    }}
                  >
                    <option value="ink">Đen</option>
                    <option value="accent">Đỏ accent</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-red-600"
                  onClick={() =>
                    setForm({
                      ...form,
                      items: form.items.filter((x) => x.id !== item.id),
                    })
                  }
                >
                  Xóa đánh giá
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() =>
            setForm({ ...form, items: [...form.items, newTestimonial()] })
          }
        >
          + Thêm đánh giá
        </Button>
      </form>
    </div>
  );
}

export function LookbookEditor({ initial }: { initial: HomeLookbookContent }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const [catDraft, setCatDraft] = useState("");

  return (
    <div>
      <AdminPageHeader title="Lookbook sản phẩm" />
      <p className="mb-5 text-sm text-ink/55">
        Tab danh mục + lưới ảnh sản phẩm trên trang chủ.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            setMessage("");
            await saveHomeLookbook(form);
            setMessage("Đã lưu lookbook.");
            router.refresh();
          });
        }}
      >
        <SaveBar pending={pending} message={message} />
        <AdminCard title="Tiêu đề section">
          <div className="space-y-3">
            <div>
              <Label>Eyebrow</Label>
              <Input
                value={form.eyebrow}
                onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
              />
            </div>
            <div>
              <Label>Tiêu đề</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Danh mục tab" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {form.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold"
              >
                {cat}
                <button
                  type="button"
                  className="text-red-600"
                  onClick={() =>
                    setForm({
                      ...form,
                      categories: form.categories.filter((c) => c !== cat),
                    })
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="BLAZER"
              value={catDraft}
              onChange={(e) => setCatDraft(e.target.value.toUpperCase())}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const next = catDraft.trim();
                if (!next || form.categories.includes(next)) return;
                setForm({ ...form, categories: [...form.categories, next] });
                setCatDraft("");
              }}
            >
              Thêm
            </Button>
          </div>
        </AdminCard>

        <div className="mt-4 space-y-4">
          {form.products.map((product, index) => (
            <AdminCard key={product.id} title={`Sản phẩm ${index + 1}`}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <Label>Tên</Label>
                    <Input
                      value={product.name}
                      onChange={(e) => {
                        const products = [...form.products];
                        products[index] = { ...product, name: e.target.value };
                        setForm({ ...form, products });
                      }}
                    />
                  </div>
                  <div>
                    <Label>Nhãn trên ảnh</Label>
                    <Input
                      value={product.label}
                      onChange={(e) => {
                        const products = [...form.products];
                        products[index] = { ...product, label: e.target.value };
                        setForm({ ...form, products });
                      }}
                    />
                  </div>
                  <div>
                    <Label>Danh mục</Label>
                    <select
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold"
                      value={product.category}
                      onChange={(e) => {
                        const products = [...form.products];
                        products[index] = {
                          ...product,
                          category: e.target.value,
                        };
                        setForm({ ...form, products });
                      }}
                    >
                      {form.categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Ảnh</Label>
                  <ImageDropzone
                    value={product.image}
                    onChange={(url) => {
                      const products = [...form.products];
                      products[index] = { ...product, image: url };
                      setForm({ ...form, products });
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="mt-3 text-xs font-semibold text-red-600"
                onClick={() =>
                  setForm({
                    ...form,
                    products: form.products.filter((p) => p.id !== product.id),
                  })
                }
              >
                Xóa sản phẩm
              </button>
            </AdminCard>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() =>
            setForm({
              ...form,
              products: [
                ...form.products,
                newLookbookProduct({
                  category: form.categories[0] || "BLAZER",
                }),
              ],
            })
          }
        >
          + Thêm sản phẩm
        </Button>
      </form>
    </div>
  );
}

export function HomeChromeEditor({
  initial,
}: {
  initial: HomeSectionChrome;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const fields: { key: keyof HomeSectionChrome; label: string; multiline?: boolean }[] =
    [
      { key: "servicesEyebrow", label: "Dịch vụ — eyebrow" },
      { key: "servicesTitle", label: "Dịch vụ — tiêu đề" },
      { key: "galleryEyebrow", label: "Gallery — eyebrow" },
      { key: "galleryTitle", label: "Gallery — tiêu đề" },
      {
        key: "galleryDescription",
        label: "Gallery — mô tả",
        multiline: true,
      },
      { key: "workflowEyebrow", label: "Quy trình — eyebrow" },
      { key: "workflowTitle", label: "Quy trình — tiêu đề" },
      {
        key: "workflowDescription",
        label: "Quy trình — mô tả",
        multiline: true,
      },
      { key: "requestTitle", label: "Form liên hệ — tiêu đề" },
      {
        key: "requestDescription",
        label: "Form liên hệ — mô tả",
        multiline: true,
      },
    ];

  return (
    <div>
      <AdminPageHeader title="Tiêu đề các section trang chủ" />
      <p className="mb-5 text-sm text-ink/55">
        Eyebrow / tiêu đề / mô tả cho Dịch vụ, Gallery, Quy trình, Form gửi yêu
        cầu.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            setMessage("");
            await saveHomeChrome(form);
            setMessage("Đã lưu tiêu đề section.");
            router.refresh();
          });
        }}
      >
        <SaveBar pending={pending} message={message} />
        <AdminCard>
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <Label>{f.label}</Label>
                {f.multiline ? (
                  <Textarea
                    rows={3}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                  />
                ) : (
                  <Input
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </AdminCard>
      </form>
    </div>
  );
}

export function AboutEditor({ initial }: { initial: AboutSectionItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <AdminPageHeader title="Giới thiệu" />
      <p className="mb-5 text-sm text-ink/55">
        Các mục trang /gioi-thieu (lịch sử, tầm nhìn, giá trị…).
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            setMessage("");
            await saveAboutSections(items);
            setMessage("Đã lưu giới thiệu.");
            router.refresh();
          });
        }}
      >
        <SaveBar pending={pending} message={message} />
        <div className="space-y-4">
          {items.map((item, index) => (
            <AdminCard key={item.id} title={`Mục ${index + 1}`}>
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label>ID (anchor)</Label>
                    <Input
                      value={item.id}
                      onChange={(e) => {
                        const next = [...items];
                        next[index] = { ...item, id: e.target.value };
                        setItems(next);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Tiêu đề</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const next = [...items];
                        next[index] = { ...item, title: e.target.value };
                        setItems(next);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Nội dung</Label>
                  <Textarea
                    rows={5}
                    value={item.content}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...item, content: e.target.value };
                      setItems(next);
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-red-600"
                  onClick={() => setItems(items.filter((x) => x.id !== item.id))}
                >
                  Xóa mục
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => setItems([...items, newAboutSection()])}
        >
          + Thêm mục
        </Button>
      </form>
    </div>
  );
}
