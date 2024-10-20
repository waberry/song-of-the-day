/*
  Warnings:

  - Changed the type of `external_urls` on the `Track` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "external_urls",
ADD COLUMN     "external_urls" JSONB NOT NULL;
