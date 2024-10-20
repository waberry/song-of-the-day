/*
  Warnings:

  - The primary key for the `GameState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `GameState` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GameState" DROP CONSTRAINT "GameState_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "GameState_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "albumName" TEXT NOT NULL,
    "spotifyUrl" TEXT NOT NULL,
    "artists" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL,
    "spotifyUserId" TEXT NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "History_playedAt_key" ON "History"("playedAt");

-- CreateIndex
CREATE INDEX "History_spotifyUserId_playedAt_idx" ON "History"("spotifyUserId", "playedAt");
