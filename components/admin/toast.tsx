"use client";

import { useSyncExternalStore } from "react";

type Toast = { id: number; message: string; tone: "ok" | "err" };

let items: Toast[] = [];
const listeners = new Set<() => void>();
let seq = 0;

function emit() {
  listeners.forEach((listener) => listener());
}

export function pushToast(message: string, tone: Toast["tone"] = "ok") {
  const id = ++seq;
  items = [...items, { id, message, tone }];
  emit();
  window.setTimeout(() => {
    items = items.filter((item) => item.id !== id);
    emit();
  }, 3200);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function ToastHost() {
  const list = useSyncExternalStore(subscribe, () => items, () => items);
  if (!list.length) return null;
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[90] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
      {list.map((item) => (
        <p
          key={item.id}
          className={
            item.tone === "err"
              ? "rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg"
              : "rounded-xl bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-white shadow-lg"
          }
        >
          {item.message}
        </p>
      ))}
    </div>
  );
}
