/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Artist` table. All the data in the column will be lost.
  - The primary key for the `TrackGenre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `genreId` on the `TrackGenre` table. All the data in the column will be lost.
  - You are about to drop the `AlbumArtist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `genre` to the `TrackGenre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AlbumArtist" DROP CONSTRAINT "AlbumArtist_albumId_fkey";

-- DropForeignKey
ALTER TABLE "AlbumArtist" DROP CONSTRAINT "AlbumArtist_artistId_fkey";

-- DropForeignKey
ALTER TABLE "TrackGenre" DROP CONSTRAINT "TrackGenre_genreId_fkey";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "external_urls" JSONB,
ADD COLUMN     "release_date" TEXT,
ADD COLUMN     "release_date_precision" TEXT,
ADD COLUMN     "total_tracks" INTEGER,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "uri" TEXT,
ALTER COLUMN "releaseDate" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "imageUrl",
ADD COLUMN     "external_urls" JSONB,
ADD COLUMN     "followers" INTEGER,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "popularity" INTEGER,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "uri" TEXT;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "available_markets" TEXT[],
ADD COLUMN     "disc_number" INTEGER,
ADD COLUMN     "duration_ms" INTEGER,
ADD COLUMN     "explicit" BOOLEAN,
ADD COLUMN     "external_urls" JSONB,
ADD COLUMN     "is_local" BOOLEAN,
ADD COLUMN     "preview_url" TEXT,
ADD COLUMN     "track_number" INTEGER,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "uri" TEXT,
ALTER COLUMN "popularity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TrackGenre" DROP CONSTRAINT "TrackGenre_pkey",
DROP COLUMN "genreId",
ADD COLUMN     "genre" TEXT NOT NULL,
ADD CONSTRAINT "TrackGenre_pkey" PRIMARY KEY ("trackId", "genre");

-- DropTable
DROP TABLE "AlbumArtist";

-- DropTable
DROP TABLE "Genre";

-- CreateTable
CREATE TABLE "AlbumImage" (
    "albumId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "height" INTEGER,
    "width" INTEGER,

    CONSTRAINT "AlbumImage_pkey" PRIMARY KEY ("albumId","url")
);

-- CreateTable
CREATE TABLE "ArtistImage" (
    "artistId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "height" INTEGER,
    "width" INTEGER,

    CONSTRAINT "ArtistImage_pkey" PRIMARY KEY ("artistId","url")
);

-- CreateTable
CREATE TABLE "GameState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pickedSongs" JSONB[],
    "dailySongFound" BOOLEAN NOT NULL DEFAULT false,
    "guessState" JSONB NOT NULL,
    "lastResetDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameState_userId_key" ON "GameState"("userId");

-- AddForeignKey
ALTER TABLE "AlbumImage" ADD CONSTRAINT "AlbumImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistImage" ADD CONSTRAINT "ArtistImage_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameState" ADD CONSTRAINT "GameState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
