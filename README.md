# May Mặc Phú Thành Nam (PTN)

Next.js + PostgreSQL + Upstash Redis + Vercel Blob.

## Local nhanh

```bash
npm install
npm run db:up          # Postgres Docker :5433
npx prisma migrate deploy
npm run db:seed
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin — `admin@phuthanhnam.vn` / `admin123`

## Kiến trúc Vercel (chuẩn)

```
Next.js (Vercel)
  ├── PostgreSQL  → dữ liệu CMS (Neon / Vercel Postgres)
  ├── Upstash Redis → cache trang + rate-limit form
  └── Vercel Blob → lưu ảnh / techpack
```

Chi tiết: [docs/DEPLOY-VERCEL.md](docs/DEPLOY-VERCEL.md)

Env mẫu: [.env.example](.env.example)

## Redis dùng để làm gì?

| Không dùng Redis cho | Dùng Redis cho |
|----------------------|----------------|
| Lưu Post/User quan hệ | Cache workflow / gallery / posts |
| Thay PostgreSQL | Rate-limit `/api/contact` |
| | Invalidate sau khi admin sửa CMS |

## Scripts

| Script | Mô tả |
|--------|--------|
| `npm run db:up` | Docker Postgres |
| `npm run db:deploy` | `prisma migrate deploy` (prod) |
| `npm run db:seed` | Seed admin + data mẫu |
| `npm run build` | `prisma generate && next build` |
