-- CreateTable
CREATE TABLE "visitors" (
    "id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "cookieId" TEXT,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "isBot" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visitors_fingerprint_key" ON "visitors"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "visitors_cookieId_key" ON "visitors"("cookieId");

-- CreateIndex
CREATE INDEX "visitors_fingerprint_idx" ON "visitors"("fingerprint");

-- CreateIndex
CREATE INDEX "visitors_cookieId_idx" ON "visitors"("cookieId");

-- CreateIndex
CREATE INDEX "visitors_visitDate_idx" ON "visitors"("visitDate");
