/*
  Warnings:

  - You are about to drop the column `spotifyUrl` on the `Album` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "spotifyUrl",
ADD COLUMN     "external_urls" TEXT;
