/*
  Warnings:

  - You are about to drop the `Guesses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Guesses" DROP CONSTRAINT "Guesses_modeId_fkey";

-- DropForeignKey
ALTER TABLE "Guesses" DROP CONSTRAINT "Guesses_userId_fkey";

-- DropTable
DROP TABLE "Guesses";

-- CreateTable
CREATE TABLE "Guess" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "modeId" TEXT NOT NULL,
    "songSpotifyId" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,

    CONSTRAINT "Guess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guess_date_key" ON "Guess"("date");

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_modeId_fkey" FOREIGN KEY ("modeId") REFERENCES "Mode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
