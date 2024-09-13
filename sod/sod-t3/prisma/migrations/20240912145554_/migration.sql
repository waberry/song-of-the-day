/*
  Warnings:

  - The `external_urls` column on the `Album` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `external_urls` on the `Artist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `external_urls` on the `History` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "external_urls",
ADD COLUMN     "external_urls" JSONB;

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "external_urls",
ADD COLUMN     "external_urls" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "History" DROP COLUMN "external_urls",
ADD COLUMN     "external_urls" JSONB NOT NULL;
