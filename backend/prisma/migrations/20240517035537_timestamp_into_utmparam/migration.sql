/*
  Warnings:

  - Added the required column `updatedAt` to the `utm_params` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "utm_params" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
