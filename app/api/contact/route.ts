import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { CacheKeys, rateLimit } from "@/lib/cache";
import { uploadFile } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "unknown";

    const limited = await rateLimit(CacheKeys.rateContact(ip), 8, 60);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút." },
        { status: 429 },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let payload: Record<string, string> = {};
    let attachmentUrl: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      payload = {
        fullName: String(form.get("fullName") || ""),
        companyName: String(form.get("companyName") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || ""),
        serviceType: String(form.get("serviceType") || ""),
        budget: String(form.get("budget") || ""),
        message: String(form.get("message") || ""),
      };

      const file = form.get("attachment");
      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadFile(file, "techpacks");
        attachmentUrl = uploaded.url;
      }
    } else {
      payload = await request.json();
    }

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName: parsed.data.fullName,
        companyName: parsed.data.companyName || null,
        email: parsed.data.email,
        phone: parsed.data.phone,
        serviceType: parsed.data.serviceType || null,
        message: parsed.data.budget
          ? `${parsed.data.message}\n\nNgân sách: ${parsed.data.budget}`
          : parsed.data.message,
        attachmentUrl,
        status: "NEW",
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Đã nhận yêu cầu liên hệ",
      id: inquiry.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
