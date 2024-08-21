/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `GameState` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gameStateId_fkey";

-- AlterTable
ALTER TABLE "GameState" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GameState_userId_key" ON "GameState"("userId");

-- AddForeignKey
ALTER TABLE "GameState" ADD CONSTRAINT "GameState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
