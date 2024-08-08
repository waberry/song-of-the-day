/*
  Warnings:

  - A unique constraint covering the columns `[anonymousUserId]` on the table `GameState` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anonymousUserId` to the `GameState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameState" ADD COLUMN     "anonymousUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameState_anonymousUserId_key" ON "GameState"("anonymousUserId");

-- CreateIndex
CREATE INDEX "GameState_anonymousUserId_idx" ON "GameState"("anonymousUserId");
