#!/usr/bin/env bash
# Deploy helper: GitHub push + Vercel env + Redis + production smoke
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
REPO_NAME="${REPO_NAME:-maymacphuthanhnam}"

echo "==> 1) Local smoke"
npm run test:smoke

echo "==> 2) GitHub auth check"
if ! gh auth status >/dev/null 2>&1; then
  echo "Chưa login GitHub CLI. Chạy: gh auth login -p ssh -w"
  exit 1
fi

OWNER="$(gh api user -q .login)"
echo "GitHub user: $OWNER"

if ! gh repo view "$OWNER/$REPO_NAME" >/dev/null 2>&1; then
  echo "==> Create repo $OWNER/$REPO_NAME"
  gh repo create "$REPO_NAME" --private --source=. --remote=origin --push
else
  echo "==> Push to existing repo"
  git remote remove origin 2>/dev/null || true
  git remote add origin "git@github.com:$OWNER/$REPO_NAME.git"
  git push -u origin HEAD:main
fi

REPO_URL="https://github.com/$OWNER/$REPO_NAME"
echo "Repo: $REPO_URL"

echo "==> 3) Vercel auth check"
if ! vercel whoami >/dev/null 2>&1; then
  echo "Chưa login Vercel. Chạy: vercel login"
  exit 1
fi

echo "==> 4) Link / deploy (production)"
# Ensure project linked
if [ ! -f .vercel/project.json ]; then
  vercel link --yes
fi

# Env vars — require DATABASE_URL and Redis already set OR pass via env
need_vars=(DATABASE_URL AUTH_SECRET AUTH_URL UPSTASH_REDIS_REST_URL UPSTASH_REDIS_REST_TOKEN)
missing=0
for v in "${need_vars[@]}"; do
  if ! vercel env ls production 2>/dev/null | grep -q "^$v"; then
    echo "⚠ Thiếu env trên Vercel production: $v"
    missing=1
  fi
done

if [ "$missing" -eq 1 ]; then
  echo ""
  echo "Thêm env (ví dụ):"
  echo "  printf '%s' \"\$DATABASE_URL\" | vercel env add DATABASE_URL production"
  echo "  printf '%s' \"\$AUTH_SECRET\" | vercel env add AUTH_SECRET production"
  echo "  printf '%s' \"https://YOUR.vercel.app\" | vercel env add AUTH_URL production"
  echo "  printf '%s' \"\$UPSTASH_REDIS_REST_URL\" | vercel env add UPSTASH_REDIS_REST_URL production"
  echo "  printf '%s' \"\$UPSTASH_REDIS_REST_TOKEN\" | vercel env add UPSTASH_REDIS_REST_TOKEN production"
  echo "  printf '%s' \"\$BLOB_READ_WRITE_TOKEN\" | vercel env add BLOB_READ_WRITE_TOKEN production"
  echo "  printf '%s' \"ptn\" | vercel env add REDIS_KEY_PREFIX production"
  echo ""
  echo "Tạo Redis nhanh: Vercel Dashboard → Storage → Upstash Redis → Connect"
  echo "Tạo Postgres: Neon / Vercel Postgres → copy DATABASE_URL"
  exit 2
fi

vercel --prod --yes

PROD_URL="$(vercel ls --prod 2>/dev/null | awk 'NR==2{print $2; exit}')"
# Prefer inspecting project
PROD_URL="${PROD_URL:-$(jq -r '.projectName // empty' .vercel/project.json 2>/dev/null)}"

echo "==> 5) Production smoke"
if [ -n "${VERCEL_PROJECT_URL:-}" ]; then
  SMOKE_BASE_URL="$VERCEL_PROJECT_URL" npm run test:smoke
elif [ -n "${PROD_SMOKE_URL:-}" ]; then
  SMOKE_BASE_URL="$PROD_SMOKE_URL" npm run test:smoke
else
  echo "Set PROD_SMOKE_URL=https://your-app.vercel.app rồi chạy lại smoke."
fi

echo "Done. GitHub: $REPO_URL"
