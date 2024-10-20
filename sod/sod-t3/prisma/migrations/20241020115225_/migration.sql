/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gameStateId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Album` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlbumArtist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlbumImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtistImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtistTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommonGameState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailySong` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `History` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Track` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackArtist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[anonymousUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anonymousUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "AlbumArtist" DROP CONSTRAINT "AlbumArtist_albumId_fkey";

-- DropForeignKey
ALTER TABLE "AlbumArtist" DROP CONSTRAINT "AlbumArtist_artistId_fkey";

-- DropForeignKey
ALTER TABLE "AlbumImage" DROP CONSTRAINT "AlbumImage_albumId_fkey";

-- DropForeignKey
ALTER TABLE "ArtistImage" DROP CONSTRAINT "ArtistImage_artistId_fkey";

-- DropForeignKey
ALTER TABLE "ArtistTrack" DROP CONSTRAINT "ArtistTrack_artistId_fkey";

-- DropForeignKey
ALTER TABLE "ArtistTrack" DROP CONSTRAINT "ArtistTrack_trackId_fkey";

-- DropForeignKey
ALTER TABLE "DailySong" DROP CONSTRAINT "DailySong_trackId_fkey";

-- DropForeignKey
ALTER TABLE "GameState" DROP CONSTRAINT "GameState_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistTrack" DROP CONSTRAINT "PlaylistTrack_trackId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistTrack" DROP CONSTRAINT "PlaylistTrack_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_albumId_fkey";

-- DropForeignKey
ALTER TABLE "TrackArtist" DROP CONSTRAINT "TrackArtist_artistId_fkey";

-- DropForeignKey
ALTER TABLE "TrackArtist" DROP CONSTRAINT "TrackArtist_trackId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_spotifyId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "emailVerified",
DROP COLUMN "gameStateId",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "spotifyId",
ADD COLUMN     "anonymousUserId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Album";

-- DropTable
DROP TABLE "AlbumArtist";

-- DropTable
DROP TABLE "AlbumImage";

-- DropTable
DROP TABLE "Artist";

-- DropTable
DROP TABLE "ArtistImage";

-- DropTable
DROP TABLE "ArtistTrack";

-- DropTable
DROP TABLE "CommonGameState";

-- DropTable
DROP TABLE "DailySong";

-- DropTable
DROP TABLE "GameState";

-- DropTable
DROP TABLE "History";

-- DropTable
DROP TABLE "PlaylistTrack";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Track";

-- DropTable
DROP TABLE "TrackArtist";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "Day" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seed" INTEGER NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,

    CONSTRAINT "Mode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guesses" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "modeId" TEXT NOT NULL,
    "songSpotifyId" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,

    CONSTRAINT "Guesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Day_date_key" ON "Day"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Mode_name_key" ON "Mode"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Guesses_date_key" ON "Guesses"("date");

-- CreateIndex
CREATE UNIQUE INDEX "User_anonymousUserId_key" ON "User"("anonymousUserId");

-- AddForeignKey
ALTER TABLE "Guesses" ADD CONSTRAINT "Guesses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guesses" ADD CONSTRAINT "Guesses_modeId_fkey" FOREIGN KEY ("modeId") REFERENCES "Mode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
