import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập Admin | PTN CMS",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-5">
      <div className="w-full max-w-md rounded-2xl border border-black/8 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f59e0b] text-sm font-semibold text-white">
            PTN
          </div>
          <div>
            <p className="text-lg font-semibold text-ink">Phú Thành Nam CMS</p>
            <p className="text-xs font-semibold text-ink/45">Diamond-style Admin</p>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-ink">Chào mừng trở lại</h1>
        <p className="mt-2 text-sm font-semibold text-ink/55">
          Đăng nhập để quản lý nội dung website
        </p>
        <Suspense fallback={<p className="mt-8 text-sm">Đang tải…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
