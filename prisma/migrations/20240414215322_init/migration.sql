-- DropForeignKey
ALTER TABLE "chatHistory" DROP CONSTRAINT "chatHistory_userId_fkey";

-- DropIndex
DROP INDEX "chat_result_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "clerkId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "chatHistory" ALTER COLUMN "userId" SET DATA TYPE TEXT;
