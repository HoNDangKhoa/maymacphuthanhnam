"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminChrome";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { paginate, TablePager } from "@/components/admin/TablePager";
import { pushToast } from "@/components/admin/toast";
import {
  deletePost,
  togglePostFlag,
  updatePostSortOrder,
} from "@/lib/actions";
import { cn } from "@/lib/utils";

export type ContentRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  thumbnail?: string | null;
  categoryName?: string | null;
  createdAt: string;
  views?: number;
  sortOrder?: number;
  isNew?: boolean;
  isVisible?: boolean;
};

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative h-6 w-11 rounded-full transition",
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

export function ContentListPage({
  typeLabel,
  createHref,
  editBasePath,
  viewBasePath,
  rows,
}: {
  title?: string;
  typeLabel: string;
  createHref: string;
  editBasePath: string;
  viewBasePath: string;
  rows: ContentRow[];
}) {
  const router = useRouter();
  const { ask, dialog } = useConfirm();
  const [q, setQ] = useState("");
  const [visibility, setVisibility] = useState<"all" | "on" | "off">("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [listKey, setListKey] = useState("");

  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();
    const list = [...rows].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );
    return list.filter((r) => {
      const visible = r.isVisible ?? r.status === "PUBLISHED";
      const matchesVisibility =
        visibility === "all" || (visibility === "on" ? visible : !visible);
      const matchesQuery =
        !key ||
        r.title.toLowerCase().includes(key) ||
        r.slug.toLowerCase().includes(key);
      return matchesVisibility && matchesQuery;
    });
  }, [rows, q, visibility]);

  const nextKey = `${q}|${visibility}|${filtered.length}`;
  if (listKey !== nextKey) {
    setListKey(nextKey);
    setPage(1);
    setSelected([]);
  }
  const view = paginate(filtered, page);

  async function removeMany() {
    if (!selected.length) return;
    const ok = await ask(
      `Xóa ${selected.length} mục đã chọn?`,
      "Các bài viết này sẽ biến mất khỏi trang công khai. Thao tác không hoàn tác được.",
    );
    if (!ok) return;
    for (const id of selected) {
      await deletePost(id);
    }
    setSelected([]);
    pushToast("Đã xóa các mục đã chọn.");
    router.refresh();
  }

  return (
    <div>
      {dialog}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link
          href={createHref}
          className="inline-flex items-center gap-2 rounded-xl bg-[#f59e0b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#d97706]"
        >
          + Thêm mới
        </Link>
        <button
          type="button"
          disabled={!selected.length}
          onClick={removeMany}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white",
            !selected.length
              ? "cursor-not-allowed bg-[#f8b4b4]/70"
              : "bg-[#f87171] hover:bg-[#ef4444]",
          )}
        >
          Xóa tất cả
        </button>
      </div>

      <AdminCard title={`Danh sách ${typeLabel}`}>
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm nhanh"
            className="min-w-[220px] flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#f59e0b]"
          />
          <select
            aria-label="Lọc hiển thị"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "all" | "on" | "off")}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#f59e0b]"
          >
            <option value="all">Tất cả</option>
            <option value="on">Đang hiển thị</option>
            <option value="off">Đang ẩn</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-[#f3f4f6] text-xs font-semibold text-ink/60 uppercase">
              <tr>
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={
                      view.rows.length > 0 &&
                      view.rows.every((r) => selected.includes(r.id))
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? view.rows.map((r) => r.id) : [],
                      )
                    }
                  />
                </th>
                <th className="px-3 py-3">STT</th>
                <th className="px-3 py-3">Hình</th>
                <th className="px-3 py-3">Tiêu đề</th>
                <th className="px-3 py-3">New</th>
                <th className="px-3 py-3">Lượt xem</th>
                <th className="px-3 py-3">Hiển thị</th>
                <th className="px-3 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {view.rows.map((row) => {
                const visible =
                  row.isVisible ??
                  (row.status === "PUBLISHED");
                return (
                  <tr key={row.id} className="border-t border-black/5">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={(e) =>
                          setSelected((prev) =>
                            e.target.checked
                              ? [...prev, row.id]
                              : prev.filter((id) => id !== row.id),
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        className="w-14 rounded-lg border border-black/10 px-2 py-1 text-center font-semibold"
                        defaultValue={row.sortOrder ?? 0}
                        onBlur={async (e) => {
                          const next = Number(e.target.value) || 0;
                          if (next === (row.sortOrder ?? 0)) return;
                          await updatePostSortOrder(row.id, next);
                          router.refresh();
                        }}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-black/5">
                        {row.thumbnail ? (
                          <Image
                            src={row.thumbnail}
                            alt={row.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`${editBasePath}/${row.id}`}
                        className="font-semibold text-ink hover:text-[#f59e0b]"
                      >
                        {row.title}
                      </Link>
                      <p className="text-xs font-semibold text-ink/40">
                        / {row.slug}
                      </p>
                      {row.categoryName && (
                        <p className="mt-1 text-xs font-semibold text-[#f59e0b]">
                          {row.categoryName}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Switch
                        checked={!!row.isNew}
                        onChange={async () => {
                          await togglePostFlag(row.id, "isNew", !row.isNew);
                          router.refresh();
                        }}
                      />
                    </td>
                    <td className="px-3 py-3 font-semibold text-ink/70">
                      {row.views ?? 0}
                    </td>
                    <td className="px-3 py-3">
                      <Switch
                        checked={visible}
                        onChange={async () => {
                          await togglePostFlag(row.id, "isVisible", !visible);
                          router.refresh();
                        }}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`${viewBasePath}/${row.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-black/5"
                        >
                          <ExternalLink size={14} />
                          Xem
                        </Link>
                        <Link
                          href={`${editBasePath}/${row.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-black/5"
                        >
                          <Pencil size={14} />
                          Sửa
                        </Link>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          onClick={async () => {
                            const ok = await ask(
                              `Xóa "${row.title}"?`,
                              "Bài viết sẽ biến mất khỏi trang công khai.",
                            );
                            if (!ok) return;
                            await deletePost(row.id);
                            pushToast("Đã xóa bài viết.");
                            router.refresh();
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
              {view.rows.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-10 text-center text-sm font-semibold text-ink/45"
                  >
                    Chưa có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePager
          page={view.page}
          pageCount={view.pageCount}
          from={view.from}
          to={view.to}
          total={view.total}
          onPage={setPage}
        />
      </AdminCard>
    </div>
  );
}
