-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "gifUrl" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "learningOutcomes" TEXT[],
ADD COLUMN     "liveUrl" TEXT,
ADD COLUMN     "technologies" TEXT[];

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "gifUrl" TEXT,
ADD COLUMN     "learningOutcomes" TEXT[],
ADD COLUMN     "role" TEXT;
