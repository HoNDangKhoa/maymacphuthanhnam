"use client";

export const PAGE_SIZE = 10;

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(page, 1), pageCount);
  const start = (current - 1) * size;
  return {
    page: current,
    pageCount,
    rows: items.slice(start, start + size),
    total: items.length,
    from: items.length ? start + 1 : 0,
    to: Math.min(start + size, items.length),
  };
}

export function TablePager({
  page,
  pageCount,
  from,
  to,
  total,
  onPage,
}: {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  onPage: (page: number) => void;
}) {
  if (total <= PAGE_SIZE) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-ink/55">
      <p>
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          className="rounded-lg border border-black/10 px-3 py-1.5 disabled:opacity-40"
          onClick={() => onPage(page - 1)}
        >
          Trước
        </button>
        <span>
          {page}/{pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          className="rounded-lg border border-black/10 px-3 py-1.5 disabled:opacity-40"
          onClick={() => onPage(page + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
