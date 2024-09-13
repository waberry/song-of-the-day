/*
  Warnings:

  - You are about to drop the column `spotifyUrl` on the `History` table. All the data in the column will be lost.
  - Added the required column `external_urls` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "spotifyUrl",
ADD COLUMN     "external_urls" TEXT NOT NULL;
