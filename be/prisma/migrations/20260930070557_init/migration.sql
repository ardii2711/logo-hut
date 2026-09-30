-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "submission_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ktp_file_path" TEXT NOT NULL,
    "logo_file_path" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "submissions_submission_code_key" ON "submissions"("submission_code");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_whatsapp_key" ON "submissions"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_email_key" ON "submissions"("email");

-- CreateIndex
CREATE INDEX "submissions_email_idx" ON "submissions"("email");

-- CreateIndex
CREATE INDEX "submissions_whatsapp_idx" ON "submissions"("whatsapp");

-- CreateIndex
CREATE INDEX "submissions_submission_code_idx" ON "submissions"("submission_code");
