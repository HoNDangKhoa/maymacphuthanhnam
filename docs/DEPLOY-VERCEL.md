# Deploy Vercel + Redis (Upstash) + PostgreSQL + Blob

## Kiến trúc chuẩn trên Vercel

| Thành phần | Dùng để | Dịch vụ khuyến nghị |
|------------|---------|---------------------|
| **PostgreSQL** | DB chính (Prisma CMS) | Neon / Vercel Postgres / Supabase |
| **Upstash Redis** | Cache CMS + rate-limit form | Vercel Storage → Upstash Redis |
| **Vercel Blob** | Upload ảnh / techpack | Vercel Storage → Blob |
| **Next.js** | App + Admin | Vercel |

> SQLite **không** chạy trên Vercel (filesystem ephemeral).  
> Redis **không** thay thế PostgreSQL cho quan hệ Post/User — Redis dùng cache/KV.

```
Browser → Vercel (Next.js)
            ├─ Prisma  → PostgreSQL (Neon)
            ├─ Cache   → Upstash Redis
            └─ Upload  → Vercel Blob
```

## 1. Local

```bash
# Postgres local
npm run db:up
# hoặc: docker compose up -d postgres

cp .env.example .env
# điền UPSTASH_* nếu có (optional local)

npx prisma migrate dev --name init_postgres
npm run db:seed
npm run dev
```

## 2. Tạo services trên Vercel

1. **PostgreSQL**: Neon → copy `DATABASE_URL` (sslmode=require)
2. **Redis**: Vercel Dashboard → Storage → Upstash Redis → Connect  
   → tự inject `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
3. **Blob**: Storage → Blob → Connect  
   → inject `BLOB_READ_WRITE_TOKEN`

## 3. Environment Variables (Vercel → Settings)

Bắt buộc:
- `DATABASE_URL`
- `AUTH_SECRET` (`openssl rand -base64 32`)
- `AUTH_URL` = `https://your-app.vercel.app`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `BLOB_READ_WRITE_TOKEN`

Tuỳ chọn:
- `REDIS_KEY_PREFIX=ptn`
- `REDIS_CACHE_TTL=300`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (chỉ khi chạy seed)

## 4. Deploy

```bash
npx vercel
# hoặc push Git → Vercel import repo
```

Build command (đã có trong `vercel.json`):
```
node scripts/copy-tinymce.js && prisma generate && prisma migrate deploy && next build
```

Hoặc chạy script sau khi đã `gh auth login` + `vercel login` + env đã set:

```bash
bash scripts/deploy-github-vercel.sh
PROD_SMOKE_URL=https://your-app.vercel.app npm run test:smoke
```

Sau deploy lần đầu, seed admin (chạy 1 lần từ máy local trỏ `DATABASE_URL` prod):

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

## 5. Redis keys

| Key | Mục đích |
|-----|----------|
| `ptn:cache:workflow` | Sticky workflow trang chủ |
| `ptn:cache:gallery` | Marquee gallery |
| `ptn:cache:settings` | Site settings |
| `ptn:cache:posts:*` | Danh sách bài |
| `ptn:cache:post:{slug}` | Chi tiết bài |
| `ptn:ratelimit:contact:{ip}` | Chống spam form liên hệ |

Admin sửa nội dung → `invalidateCmsCache()` xoá Redis + `revalidatePath`.

## 6. Checklist production

- [ ] `DATABASE_URL` Postgres + migrate deploy
- [ ] Upstash Redis connected
- [ ] Vercel Blob connected
- [ ] `AUTH_SECRET` mạnh, `AUTH_URL` đúng domain
- [ ] Seed admin xong, đổi mật khẩu
- [ ] Region `sin1` (Singapore) gần VN — chỉnh trong `vercel.json` nếu cần
