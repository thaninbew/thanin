/*
  Warnings:

  - The `learningOutcomes` column on the `Experience` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `learningOutcomes` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "extraImages" TEXT[],
DROP COLUMN "learningOutcomes",
ADD COLUMN     "learningOutcomes" JSONB[];

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "extraImages" TEXT[],
DROP COLUMN "learningOutcomes",
ADD COLUMN     "learningOutcomes" JSONB[];
