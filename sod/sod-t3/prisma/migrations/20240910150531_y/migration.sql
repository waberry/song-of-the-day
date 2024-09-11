/*
  Warnings:

  - The `pickedSongs` column on the `GameState` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "pickedSongs",
ADD COLUMN     "pickedSongs" JSONB[];
