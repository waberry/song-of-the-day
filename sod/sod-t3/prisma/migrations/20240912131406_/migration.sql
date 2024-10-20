/*
  Warnings:

  - You are about to drop the column `duration` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `previewUrl` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `release_date` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyUrl` on the `Track` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uri]` on the table `Track` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration_ms` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_urls` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uri` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Made the column `disc_number` on table `Track` required. This step will fail if there are existing NULL values in that column.
  - Made the column `explicit` on table `Track` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_local` on table `Track` required. This step will fail if there are existing NULL values in that column.
  - Made the column `track_number` on table `Track` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Track` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "duration",
DROP COLUMN "previewUrl",
DROP COLUMN "release_date",
DROP COLUMN "spotifyUrl",
ADD COLUMN     "duration_ms" INTEGER NOT NULL,
ADD COLUMN     "external_urls" JSONB NOT NULL,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "is_playable" BOOLEAN,
ADD COLUMN     "linked_from" JSONB,
ADD COLUMN     "preview_url" TEXT,
ADD COLUMN     "restrictions" JSONB,
ADD COLUMN     "uri" TEXT NOT NULL,
ALTER COLUMN "disc_number" SET NOT NULL,
ALTER COLUMN "explicit" SET NOT NULL,
ALTER COLUMN "is_local" SET NOT NULL,
ALTER COLUMN "is_local" SET DEFAULT false,
ALTER COLUMN "track_number" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'track';

-- CreateIndex
CREATE UNIQUE INDEX "Track_uri_key" ON "Track"("uri");
