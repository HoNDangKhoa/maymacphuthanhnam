"use client";

import { useEffect, useRef } from "react";

let lockCount = 0;
let savedOverflow = "";

export function useOverlay(open: boolean, onClose: () => void) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    if (lockCount++ === 0) {
      savedOverflow = root.style.overflow;
      root.style.overflow = "hidden";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (--lockCount === 0) root.style.overflow = savedOverflow;
    };
  }, [open]);
}
