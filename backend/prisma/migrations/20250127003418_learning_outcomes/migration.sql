/*
  Warnings:

  - You are about to drop the column `learningOutcomes` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `learningOutcomes` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "learningOutcomes";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "learningOutcomes";

-- CreateTable
CREATE TABLE "LearningOutcome" (
    "id" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "projectId" TEXT,
    "experienceId" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LearningOutcome_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LearningOutcome" ADD CONSTRAINT "LearningOutcome_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningOutcome" ADD CONSTRAINT "LearningOutcome_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
