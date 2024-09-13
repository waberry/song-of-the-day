/*
  Warnings:

  - You are about to drop the column `releaseDate` on the `Album` table. All the data in the column will be lost.
  - Added the required column `release_date` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "releaseDate",
ADD COLUMN     "release_date" TEXT;

-- AlterTable
ALTER TABLE "DailySong" ADD COLUMN     "genres" TEXT[];

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "release_date" TEXT NOT NULL;
