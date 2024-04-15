/*
  Warnings:

  - You are about to drop the column `userId` on the `ChatHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userChatId` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.
  - Made the column `clerkId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ChatHistory" DROP COLUMN "userId",
ADD COLUMN     "userChatId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "clerkId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "ChatHistory" ADD CONSTRAINT "ChatHistory_userChatId_fkey" FOREIGN KEY ("userChatId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
