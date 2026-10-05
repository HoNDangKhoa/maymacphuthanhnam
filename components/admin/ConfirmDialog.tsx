"use client";

import { useCallback, useState } from "react";

type Pending = {
  title: string;
  detail?: string;
  confirmLabel: string;
  resolve: (ok: boolean) => void;
};

export function useConfirm() {
  const [pending, setPending] = useState<Pending | null>(null);

  const ask = useCallback(
    (title: string, detail?: string, confirmLabel = "Xóa") =>
      new Promise<boolean>((resolve) => {
        setPending({ title, detail, confirmLabel, resolve });
      }),
    [],
  );

  function close(ok: boolean) {
    pending?.resolve(ok);
    setPending(null);
  }

  const dialog = pending ? (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-4 sm:items-center"
      role="dialog"
      aria-modal
      aria-labelledby="confirm-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 id="confirm-title" className="text-lg font-semibold text-ink">
          {pending.title}
        </h2>
        {pending.detail ? (
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            {pending.detail}
          </p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold hover:bg-black/5"
            onClick={() => close(false)}
          >
            Hủy
          </button>
          <button
            type="button"
            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
            onClick={() => close(true)}
          >
            {pending.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { ask, dialog };
}
