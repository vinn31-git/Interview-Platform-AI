-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_userId_fkey";

-- AlterTable
ALTER TABLE "Interview" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
