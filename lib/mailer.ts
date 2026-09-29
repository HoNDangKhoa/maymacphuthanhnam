import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

async function getMailer() {
  const s = await prisma.siteSetting.findUnique({ where: { id: "site_config" } });
  const host = s?.mailerHost?.trim();
  const user = s?.mailerEmail?.trim();
  const pass = s?.mailerPassword?.replace(/\s+/g, "");
  if (!host || !user || !pass) return null;
  const secure = s?.mailerSecure === "SSL";
  const port = Number(s?.mailerPort) || (secure ? 465 : 587);
  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: s?.mailerSecure === "TLS",
    auth: { user, pass },
  });
  return {
    transport,
    from: `"${s?.companyName || "Phú Thành Nam"}" <${user}>`,
    to: s?.email?.trim() || user,
  };
}

const escape = (v: string) =>
  v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function sendInquiryEmail(inquiry: {
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  serviceType?: string | null;
  message: string;
  attachmentUrl?: string | null;
}) {
  const mailer = await getMailer();
  if (!mailer) return;
  const rows: [string, string | null | undefined][] = [
    ["Họ tên", inquiry.fullName],
    ["Công ty", inquiry.companyName],
    ["Email", inquiry.email],
    ["Điện thoại", inquiry.phone],
    ["Dịch vụ", inquiry.serviceType],
    ["File đính kèm", inquiry.attachmentUrl],
  ];
  const html = `
    <h2>Yêu cầu liên hệ mới</h2>
    <table cellpadding="6">${rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escape(String(v))}</td></tr>`)
      .join("")}</table>
    <p style="white-space:pre-line">${escape(inquiry.message)}</p>`;
  await mailer.transport.sendMail({
    from: mailer.from,
    to: mailer.to,
    replyTo: inquiry.email,
    subject: `[Liên hệ] ${inquiry.fullName} — ${inquiry.phone}`,
    html,
  });
}

export async function sendTestEmail() {
  const mailer = await getMailer();
  if (!mailer) {
    throw new Error("Chưa đủ cấu hình mailer (Host, Email, Password).");
  }
  await mailer.transport.verify();
  await mailer.transport.sendMail({
    from: mailer.from,
    to: mailer.to,
    subject: "Email thử từ website Phú Thành Nam",
    html: "<p>Cấu hình mailer hoạt động bình thường.</p>",
  });
  return mailer.to;
}
