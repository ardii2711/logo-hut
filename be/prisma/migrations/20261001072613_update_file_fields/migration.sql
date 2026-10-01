/*
  Warnings:

  - You are about to drop the column `description` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `logo_file_path` on the `submissions` table. All the data in the column will be lost.
  - Added the required column `filosofi_pdf_file_path` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo_jpeg_file_path` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo_png_file_path` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo_vector_file_path` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surat_pernyataan_file_path` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "description",
DROP COLUMN "logo_file_path",
ADD COLUMN     "filosofi_pdf_file_path" TEXT NOT NULL,
ADD COLUMN     "logo_jpeg_file_path" TEXT NOT NULL,
ADD COLUMN     "logo_png_file_path" TEXT NOT NULL,
ADD COLUMN     "logo_vector_file_path" TEXT NOT NULL,
ADD COLUMN     "surat_pernyataan_file_path" TEXT NOT NULL;
