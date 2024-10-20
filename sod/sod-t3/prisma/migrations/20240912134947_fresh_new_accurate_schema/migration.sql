/*
  Warnings:

  - You are about to drop the column `spotifyUrl` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `genres` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `linked_from` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Track` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uri]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_urls` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `href` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uri` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followers` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Made the column `popularity` on table `Artist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Artist` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `disc_number` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_ids` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `href` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Made the column `popularity` on table `Track` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "spotifyUrl",
ADD COLUMN     "external_urls" JSONB NOT NULL,
ADD COLUMN     "href" TEXT NOT NULL,
ADD COLUMN     "uri" TEXT NOT NULL,
DROP COLUMN "followers",
ADD COLUMN     "followers" JSONB NOT NULL,
ALTER COLUMN "popularity" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'artist';

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "createdAt",
DROP COLUMN "genres",
DROP COLUMN "linked_from",
DROP COLUMN "updatedAt",
ADD COLUMN     "disc_number" INTEGER NOT NULL,
ADD COLUMN     "external_ids" JSONB NOT NULL,
ADD COLUMN     "href" TEXT NOT NULL,
ALTER COLUMN "popularity" SET NOT NULL,
ALTER COLUMN "is_local" DROP DEFAULT,
ALTER COLUMN "type" DROP DEFAULT;

-- CreateTable
CREATE TABLE "AlbumArtist" (
    "artistId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "AlbumArtist_pkey" PRIMARY KEY ("artistId","albumId")
);

-- CreateTable
CREATE TABLE "ArtistTrack" (
    "artistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "ArtistTrack_pkey" PRIMARY KEY ("artistId","trackId")
);

-- CreateTable
CREATE TABLE "PlaylistTrack" (
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL,
    "is_local" BOOLEAN NOT NULL,

    CONSTRAINT "PlaylistTrack_pkey" PRIMARY KEY ("userId","trackId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_uri_key" ON "Artist"("uri");

-- AddForeignKey
ALTER TABLE "AlbumArtist" ADD CONSTRAINT "AlbumArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumArtist" ADD CONSTRAINT "AlbumArtist_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistTrack" ADD CONSTRAINT "ArtistTrack_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistTrack" ADD CONSTRAINT "ArtistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
