/*
  Warnings:

  - You are about to drop the column `userId` on the `GameState` table. All the data in the column will be lost.
  - Changed the type of `pickedSongs` on the `GameState` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "GameState" DROP CONSTRAINT "GameState_userId_fkey";

-- DropIndex
DROP INDEX "GameState_userId_key";

-- AlterTable
ALTER TABLE "DailySong" ALTER COLUMN "selectedDate" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "userId",
DROP COLUMN "pickedSongs",
ADD COLUMN     "pickedSongs" JSONB NOT NULL,
ALTER COLUMN "dailySongFound" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gameStateId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gameStateId_fkey" FOREIGN KEY ("gameStateId") REFERENCES "GameState"("id") ON DELETE SET NULL ON UPDATE CASCADE;
