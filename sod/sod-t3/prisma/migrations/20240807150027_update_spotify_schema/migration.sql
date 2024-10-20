/*
  Warnings:

  - You are about to drop the column `external_urls` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `release_date` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `uri` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `external_urls` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `uri` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `duration_ms` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `external_urls` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `preview_url` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `uri` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the `TrackGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TrackGenre" DROP CONSTRAINT "TrackGenre_trackId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "external_urls",
DROP COLUMN "release_date",
DROP COLUMN "uri",
ALTER COLUMN "releaseDate" DROP NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "spotifyUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "external_urls",
DROP COLUMN "uri",
ALTER COLUMN "spotifyUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "duration_ms",
DROP COLUMN "external_urls",
DROP COLUMN "preview_url",
DROP COLUMN "uri";

-- DropTable
DROP TABLE "TrackGenre";
