/*
  Warnings:

  - You are about to drop the column `lastResetDate` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spotifyId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastResetDate",
ADD COLUMN     "spotifyId" TEXT;

-- CreateTable
CREATE TABLE "CommonGameState" (
    "id" SERIAL NOT NULL,
    "lastResetDate" TIMESTAMP(3),

    CONSTRAINT "CommonGameState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_spotifyId_key" ON "User"("spotifyId");
