/*
  Warnings:

  - You are about to drop the column `userChatId` on the `ChatHistory` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatHistory" DROP CONSTRAINT "ChatHistory_userChatId_fkey";

-- AlterTable
ALTER TABLE "ChatHistory" DROP COLUMN "userChatId",
ADD COLUMN     "userId" TEXT NOT NULL;
