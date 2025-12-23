/*
  Warnings:

  - You are about to drop the column `price` on the `training` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "module" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sub_module" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "training" DROP COLUMN "price",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
