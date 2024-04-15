/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_chatHistoryId_fkey";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "ChatHistory";

-- CreateTable
CREATE TABLE "chat" (
    "id" SERIAL NOT NULL,
    "prompt" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "chatHistoryId" INTEGER,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatHistory" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "chatHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_chatHistoryId_fkey" FOREIGN KEY ("chatHistoryId") REFERENCES "chatHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
