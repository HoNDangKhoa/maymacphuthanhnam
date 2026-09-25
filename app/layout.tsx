import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "May Mặc Phú Thành Nam | Chính xác · Quy mô · Chất lượng",
    template: "%s | Phú Thành Nam",
  },
  description:
    "Công ty May Mặc Phú Thành Nam — đối tác gia công OEM/ODM & CMT chuẩn xuất khẩu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-semibold antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
