/*
  Warnings:

  - You are about to drop the `chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chatHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_chatHistoryId_fkey";

-- DropTable
DROP TABLE "chat";

-- DropTable
DROP TABLE "chatHistory";

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "prompt" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "chatHistoryId" INTEGER,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatHistory" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,

    CONSTRAINT "ChatHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_chatHistoryId_fkey" FOREIGN KEY ("chatHistoryId") REFERENCES "ChatHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
