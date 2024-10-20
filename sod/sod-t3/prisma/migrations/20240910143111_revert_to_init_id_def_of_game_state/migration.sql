/*
  Warnings:

  - The primary key for the `GameState` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "GameState" DROP CONSTRAINT "GameState_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "GameState_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GameState_id_seq";
