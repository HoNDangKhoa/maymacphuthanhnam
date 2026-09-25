-- CreateTable
CREATE TABLE IF NOT EXISTS "VisitLog" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL DEFAULT '/',
    "ip" TEXT,
    "browser" TEXT NOT NULL DEFAULT 'Khác',
    "device" TEXT NOT NULL DEFAULT 'desktop',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VisitLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "VisitLog_createdAt_idx" ON "VisitLog"("createdAt");
CREATE INDEX IF NOT EXISTS "VisitLog_browser_idx" ON "VisitLog"("browser");
CREATE INDEX IF NOT EXISTS "VisitLog_device_idx" ON "VisitLog"("device");
CREATE INDEX IF NOT EXISTS "VisitLog_ip_idx" ON "VisitLog"("ip");
