"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { ImageDropzone } from "@/components/admin/BrandAssetForm";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  deleteProduct,
  deleteProducts,
  saveProduct,
  saveProductCategories,
  setProductPosition,
  setProductVisible,
} from "@/lib/actions";
import { toRichHtml } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import {
  slugify,
  type HomeLookbookProduct,
  type ProductCategoryInfo,
} from "@/lib/home-content";

export type CategoryOption = { key: string; name: string };

const selectClass =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm";

function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        "relative h-6 w-11 rounded-full transition disabled:opacity-60",
        checked ? "bg-[#f59e0b]" : "bg-black/15",
      )}
      onClick={onChange}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

const actionLink =
  "inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-black/5";

export function ProductList({
  products,
  categories,
}: {
  products: (HomeLookbookProduct & { href: string })[];
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const nameOf = (key: string) =>
    categories.find((c) => c.key === key)?.name ?? key;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.href.toLowerCase().includes(q)),
    );
  }, [products, query, category]);

  const run = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#f59e0b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#d97706]"
        >
          + Thêm mới
        </Link>
        <button
          type="button"
          disabled={!selected.length || pending}
          onClick={() => {
            if (!confirm(`Xóa ${selected.length} sản phẩm đã chọn?`)) return;
            run(async () => {
              await deleteProducts(selected);
              setSelected([]);
            });
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white",
            !selected.length
              ? "cursor-not-allowed bg-[#f8b4b4]/70"
              : "bg-[#f87171] hover:bg-[#ef4444]",
          )}
        >
          Xóa tất cả
        </button>
        <Link
          href="/admin/product-categories"
          className="ml-auto inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-black/5"
        >
          Danh mục sản phẩm
        </Link>
      </div>

      <AdminCard title="Danh sách sản phẩm">
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm nhanh"
            className="min-w-[220px] flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#f59e0b]"
          />
          <select
            aria-label="Lọc danh mục"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#f59e0b]"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#f3f4f6] text-xs font-semibold text-ink/60 uppercase">
              <tr>
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    aria-label="Chọn tất cả"
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={(e) =>
                      setSelected(e.target.checked ? rows.map((r) => r.id) : [])
                    }
                  />
                </th>
                <th className="px-3 py-3">STT</th>
                <th className="px-3 py-3">Hình</th>
                <th className="px-3 py-3">Tên sản phẩm</th>
                <th className="px-3 py-3">Ảnh chi tiết</th>
                <th className="px-3 py-3">Hiển thị</th>
                <th className="px-3 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const position = products.findIndex((x) => x.id === p.id) + 1;
                const visible = p.isVisible !== false;
                const editHref = `/admin/products/${encodeURIComponent(p.id)}`;
                return (
                  <tr key={p.id} className="border-t border-black/5">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Chọn ${p.name}`}
                        checked={selected.includes(p.id)}
                        onChange={(e) =>
                          setSelected((prev) =>
                            e.target.checked
                              ? [...prev, p.id]
                              : prev.filter((id) => id !== p.id),
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        key={`${p.id}-${position}`}
                        type="number"
                        min={1}
                        max={products.length}
                        aria-label="Thứ tự"
                        className="w-14 rounded-lg border border-black/10 px-2 py-1 text-center font-semibold"
                        defaultValue={position}
                        onBlur={(e) => {
                          const next = Number(e.target.value) || position;
                          if (next === position) return;
                          run(() => setProductPosition(p.id, next));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                        }}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-black/5">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={editHref}
                        className="font-semibold text-ink hover:text-[#f59e0b]"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs font-semibold text-ink/40">
                        {p.href}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#f59e0b]">
                        {nameOf(p.category)}
                      </p>
                    </td>
                    <td className="px-3 py-3 font-semibold text-ink/70">
                      {(p.gallery ?? []).filter(Boolean).length}
                    </td>
                    <td className="px-3 py-3">
                      <Switch
                        checked={visible}
                        disabled={pending}
                        onChange={() =>
                          run(() => setProductVisible(p.id, !visible))
                        }
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={p.href} target="_blank" className={actionLink}>
                          <ExternalLink size={14} />
                          Xem
                        </Link>
                        <Link href={editHref} className={actionLink}>
                          <Pencil size={14} />
                          Sửa
                        </Link>
                        <button
                          type="button"
                          disabled={pending}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          onClick={() => {
                            if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
                            run(() => deleteProduct(p.id));
                          }}
                        >
                          <Trash2 size={14} />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-sm font-semibold text-ink/45"
                  >
                    Chưa có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg disabled:opacity-30 ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-ink/60 hover:bg-black/5 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function ProductForm({
  initial,
  categories,
  isNew,
  viewHref,
}: {
  initial: HomeLookbookProduct;
  categories: CategoryOption[];
  isNew: boolean;
  viewHref?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({
    ...initial,
    description: toRichHtml(initial.description),
  }));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const set = (patch: Partial<HomeLookbookProduct>) =>
    setForm((f) => ({ ...f, ...patch }));
  const gallery = form.gallery ?? [];

  const submit = (exit: boolean) =>
    startTransition(async () => {
      setMessage("");
      setError("");
      const res = await saveProduct(form);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      set({ slug: res.slug });
      if (exit) {
        router.push("/admin/products");
      } else if (isNew) {
        router.replace(`/admin/products/${encodeURIComponent(form.id)}`);
      } else {
        setMessage("Đã lưu sản phẩm.");
        router.refresh();
      }
    });

  return (
    <div>
      <AdminPageHeader
        title={isNew ? "Thêm sản phẩm" : `Sửa: ${initial.name}`}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(false);
        }}
      >
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            disabled={pending}
            className="bg-[#f59e0b] hover:bg-[#d97706]"
          >
            {pending ? "Đang lưu…" : "Lưu"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => submit(true)}
          >
            Lưu & quay lại
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Thoát
          </Button>
          {viewHref && (
            <a
              href={viewHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 text-sm font-semibold text-[#d97706]"
            >
              Xem trên web <ExternalLink size={14} />
            </a>
          )}
          {message && (
            <span className="text-sm font-semibold text-emerald-600">
              {message}
            </span>
          )}
          {error && (
            <span className="text-sm font-semibold text-red-600">{error}</span>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <AdminCard title="Thông tin sản phẩm" className="lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Tên sản phẩm *</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    set(slugTouched ? { name } : { name, slug: slugify(name) });
                  }}
                />
              </div>
              <div>
                <Label>Đường dẫn (slug)</Label>
                <Input
                  value={form.slug ?? ""}
                  placeholder="ao-blazer"
                  onChange={(e) => {
                    setSlugTouched(true);
                    set({ slug: e.target.value });
                  }}
                />
                <p className="mt-1 text-xs text-ink/50">
                  /san-pham/{slugify(form.slug || form.name) || "…"}
                </p>
              </div>
              <div>
                <Label>Danh mục</Label>
                <select
                  className={selectClass}
                  value={form.category}
                  onChange={(e) => set({ category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <Switch
                  checked={form.isVisible !== false}
                  onChange={() => set({ isVisible: form.isVisible === false })}
                />
                <span className="text-sm font-semibold text-ink">
                  Hiển thị trên website
                </span>
              </div>
              <div>
                <Label>Nhãn trên ảnh (trang chủ)</Label>
                <Input
                  value={form.label}
                  placeholder={form.name.toUpperCase() || "ÁO BLAZER"}
                  onChange={(e) => set({ label: e.target.value })}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Ảnh đại diện">
            <ImageDropzone
              value={form.image}
              onChange={(url) => set({ image: url })}
            />
          </AdminCard>
        </div>

        <AdminCard title="Nội dung trang chi tiết" className="mt-4">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nhãn nhỏ phía trên (hiển thị trong [ ])</Label>
                <Input
                  value={form.eyebrow ?? ""}
                  placeholder="Thiết kế để truyền cảm hứng"
                  onChange={(e) => set({ eyebrow: e.target.value })}
                />
              </div>
              <div>
                <Label>Tiêu đề chi tiết</Label>
                <Input
                  value={form.detailTitle ?? ""}
                  placeholder="Form dáng chuẩn — đường may tinh tế"
                  onChange={(e) => set({ detailTitle: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Mô tả chi tiết</Label>
              <TipTapEditor
                height={360}
                value={form.description ?? ""}
                onChange={(html) => set({ description: html })}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Thư viện ảnh chi tiết" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nhãn nhỏ phần ảnh</Label>
              <Input
                value={form.galleryEyebrow ?? ""}
                placeholder="Từ ý tưởng đến thành phẩm"
                onChange={(e) => set({ galleryEyebrow: e.target.value })}
              />
            </div>
            <div>
              <Label>Tiêu đề phần ảnh</Label>
              <Input
                value={form.galleryTitle ?? ""}
                placeholder="Khám phá sự kết hợp giữa sáng tạo và công nghệ ở từng công đoạn"
                onChange={(e) => set({ galleryTitle: e.target.value })}
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-ink/50">
            Ảnh hiển thị theo cặp 2 cột (ví dụ ảnh thành phẩm + ảnh phác thảo).
            Nên dùng ảnh nền trắng, cùng tỉ lệ.
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((src, i) => (
              <div key={i} className="rounded-xl border border-black/5 p-3">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink/60">
                  <span>Ảnh {i + 1}</span>
                  <span className="flex gap-1">
                    <IconButton
                      label="Lên"
                      disabled={i === 0}
                      onClick={() => {
                        const next = [...gallery];
                        [next[i - 1], next[i]] = [next[i]!, next[i - 1]!];
                        set({ gallery: next });
                      }}
                    >
                      <ArrowUp size={14} />
                    </IconButton>
                    <IconButton
                      label="Xuống"
                      disabled={i === gallery.length - 1}
                      onClick={() => {
                        const next = [...gallery];
                        [next[i + 1], next[i]] = [next[i]!, next[i + 1]!];
                        set({ gallery: next });
                      }}
                    >
                      <ArrowDown size={14} />
                    </IconButton>
                    <IconButton
                      label="Xóa ảnh"
                      danger
                      onClick={() =>
                        set({ gallery: gallery.filter((_, j) => j !== i) })
                      }
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </span>
                </div>
                <ImageDropzone
                  value={src}
                  onChange={(url) => {
                    const next = [...gallery];
                    next[i] = url;
                    set({ gallery: next });
                  }}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => set({ gallery: [...gallery, ""] })}
          >
            + Thêm ảnh
          </Button>
        </AdminCard>

        {!isNew && (
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
            onClick={() => {
              if (!confirm(`Xóa sản phẩm "${initial.name}"?`)) return;
              startTransition(async () => {
                await deleteProduct(initial.id);
                router.push("/admin/products");
              });
            }}
          >
            <Trash2 size={15} /> Xóa sản phẩm này
          </button>
        )}
      </form>
    </div>
  );
}

type CategoryRow = ProductCategoryInfo & { key: string; count: number };

export function ProductCategoriesEditor({
  initial,
}: {
  initial: CategoryRow[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const update = (i: number, patch: Partial<CategoryRow>) =>
    setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  return (
    <div>
      <AdminPageHeader title="Danh mục sản phẩm" />
      <p className="mb-5 text-sm text-ink/55">
        Danh mục hiển thị trên menu header, trang /san-pham và bộ lọc trang chủ.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            setMessage("");
            setError("");
            const res = await saveProductCategories(
              rows.map((r) => r.key),
              Object.fromEntries(
                rows.map((r) => [
                  r.key,
                  { name: r.name, description: r.description, image: r.image },
                ]),
              ),
            );
            if (!res.ok) {
              setError(res.error);
              return;
            }
            setMessage("Đã lưu danh mục.");
            router.refresh();
          });
        }}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
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
          {error && (
            <span className="text-sm font-semibold text-red-600">{error}</span>
          )}
        </div>

        <div className="space-y-4">
          {rows.map((row, i) => (
            <AdminCard key={row.key} title={`${row.name || row.key} (${row.count} sản phẩm)`}>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-3 md:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Mã danh mục</Label>
                      <Input value={row.key} disabled />
                    </div>
                    <div>
                      <Label>Tên hiển thị</Label>
                      <Input
                        value={row.name}
                        placeholder="Áo Blazer"
                        onChange={(e) => update(i, { name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Mô tả ngắn</Label>
                    <Textarea
                      rows={3}
                      value={row.description}
                      onChange={(e) =>
                        update(i, { description: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-xs text-ink/50">
                    Đường dẫn: /san-pham?danh-muc={slugify(row.key)}
                  </p>
                </div>
                <div>
                  <Label>Ảnh banner danh mục</Label>
                  <ImageDropzone
                    value={row.image}
                    onChange={(url) => update(i, { image: url })}
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/5 pt-3">
                <IconButton
                  label="Lên"
                  disabled={i === 0}
                  onClick={() =>
                    setRows((r) => {
                      const next = [...r];
                      [next[i - 1], next[i]] = [next[i]!, next[i - 1]!];
                      return next;
                    })
                  }
                >
                  <ArrowUp size={15} />
                </IconButton>
                <IconButton
                  label="Xuống"
                  disabled={i === rows.length - 1}
                  onClick={() =>
                    setRows((r) => {
                      const next = [...r];
                      [next[i + 1], next[i]] = [next[i]!, next[i + 1]!];
                      return next;
                    })
                  }
                >
                  <ArrowDown size={15} />
                </IconButton>
                <button
                  type="button"
                  disabled={row.count > 0}
                  title={
                    row.count > 0
                      ? "Chuyển hoặc xóa sản phẩm trong danh mục trước"
                      : undefined
                  }
                  className="ml-auto text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:text-ink/30"
                  onClick={() => setRows((r) => r.filter((_, j) => j !== i))}
                >
                  {row.count > 0
                    ? "Không thể xóa (còn sản phẩm)"
                    : "Xóa danh mục"}
                </button>
              </div>
            </AdminCard>
          ))}
        </div>

        <AdminCard title="Thêm danh mục" className="mt-4">
          <div className="flex flex-wrap gap-2">
            <Input
              className="max-w-xs"
              placeholder="Mã danh mục, ví dụ: SHIRT"
              value={draft}
              onChange={(e) => setDraft(e.target.value.toUpperCase())}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const key = draft.trim();
                if (!key || rows.some((r) => r.key === key)) return;
                setRows((r) => [
                  ...r,
                  { key, name: "", description: "", image: "", count: 0 },
                ]);
                setDraft("");
              }}
            >
              Thêm
            </Button>
          </div>
          <p className="mt-2 text-xs text-ink/50">
            Nhấn &quot;Lưu thay đổi&quot; sau khi thêm để áp dụng.
          </p>
        </AdminCard>
      </form>
    </div>
  );
}
