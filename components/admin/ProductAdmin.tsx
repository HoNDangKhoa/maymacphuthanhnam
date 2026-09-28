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
import {
  AdminCard,
  AdminPageHeader,
  ContentToolbar,
} from "@/components/admin/AdminChrome";
import { ImageDropzone } from "@/components/admin/BrandAssetForm";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  deleteProduct,
  moveProduct,
  saveProduct,
  saveProductCategories,
} from "@/lib/actions";
import {
  slugify,
  type HomeLookbookProduct,
  type ProductCategoryInfo,
} from "@/lib/home-content";

export type CategoryOption = { key: string; name: string };

const selectClass =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm";

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
  const [pending, startTransition] = useTransition();
  const nameOf = (key: string) =>
    categories.find((c) => c.key === key)?.name ?? key;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q)),
    );
  }, [products, query, category]);
  const filtered = Boolean(query.trim() || category);

  return (
    <div>
      <AdminPageHeader title="Danh sách sản phẩm" />
      <ContentToolbar
        createHref="/admin/products/new"
        createLabel="Thêm sản phẩm"
        searchPlaceholder="Tìm theo tên sản phẩm"
        searchValue={query}
        onSearchChange={setQuery}
      />
      <AdminCard title={`Sản phẩm (${rows.length})`}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Label className="mb-0">Lọc danh mục</Label>
          <select
            className={`${selectClass} max-w-xs`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
          <Link
            href="/admin/product-categories"
            className="text-sm font-semibold text-[#d97706] underline"
          >
            Quản lý danh mục
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#f3f4f6] text-xs font-semibold text-ink/60">
              <tr>
                <th className="px-3 py-3">STT</th>
                <th className="px-3 py-3">Ảnh</th>
                <th className="px-3 py-3">Tên sản phẩm</th>
                <th className="px-3 py-3">Danh mục</th>
                <th className="px-3 py-3">Đường dẫn</th>
                <th className="px-3 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const index = products.findIndex((x) => x.id === p.id);
                return (
                  <tr key={p.id} className="border-t border-black/5">
                    <td className="px-3 py-3 font-semibold">{index + 1}</td>
                    <td className="px-3 py-3">
                      <div className="relative h-14 w-11 overflow-hidden rounded-md bg-black/5">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-semibold">
                      <Link
                        href={`/admin/products/${encodeURIComponent(p.id)}`}
                        className="hover:text-[#d97706]"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3">{nameOf(p.category)}</td>
                    <td className="px-3 py-3 text-ink/50">{p.href}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <IconButton
                          label="Lên"
                          disabled={pending || filtered || index === 0}
                          onClick={() =>
                            startTransition(async () => {
                              await moveProduct(p.id, -1);
                              router.refresh();
                            })
                          }
                        >
                          <ArrowUp size={15} />
                        </IconButton>
                        <IconButton
                          label="Xuống"
                          disabled={
                            pending || filtered || index === products.length - 1
                          }
                          onClick={() =>
                            startTransition(async () => {
                              await moveProduct(p.id, 1);
                              router.refresh();
                            })
                          }
                        >
                          <ArrowDown size={15} />
                        </IconButton>
                        <Link
                          href={`/admin/products/${encodeURIComponent(p.id)}`}
                          aria-label="Sửa"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/60 hover:bg-black/5 hover:text-ink"
                        >
                          <Pencil size={15} />
                        </Link>
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Xem trên web"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/60 hover:bg-black/5 hover:text-ink"
                        >
                          <ExternalLink size={15} />
                        </a>
                        <IconButton
                          label="Xóa"
                          danger
                          disabled={pending}
                          onClick={() => {
                            if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
                            startTransition(async () => {
                              await deleteProduct(p.id);
                              router.refresh();
                            });
                          }}
                        >
                          <Trash2 size={15} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-ink/50">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered && (
          <p className="mt-3 text-xs text-ink/50">
            Bỏ lọc để sắp xếp thứ tự hiển thị.
          </p>
        )}
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
  const [form, setForm] = useState(initial);
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
              <Label>Mô tả (xuống 2 dòng để tách đoạn, **chữ** để in đậm)</Label>
              <Textarea
                rows={7}
                value={form.description ?? ""}
                onChange={(e) => set({ description: e.target.value })}
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
