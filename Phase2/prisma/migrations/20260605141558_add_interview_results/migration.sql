-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "answers" JSONB,
ADD COLUMN     "evaluation" JSONB,
ADD COLUMN     "questions" JSONB,
ADD COLUMN     "score" INTEGER;
