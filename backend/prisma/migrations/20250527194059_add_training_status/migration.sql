-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "trainings" ADD COLUMN     "status" "TrainingStatus" NOT NULL DEFAULT 'DRAFT';
