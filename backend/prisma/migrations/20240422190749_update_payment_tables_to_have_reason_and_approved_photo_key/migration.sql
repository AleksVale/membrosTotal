-- AlterTable
ALTER TABLE "payment_requests" ADD COLUMN     "approvedPhotoKey" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "approvedPhotoKey" TEXT,
ADD COLUMN     "reason" TEXT;

-- AlterTable
ALTER TABLE "refunds" ADD COLUMN     "approvedPhotoKey" TEXT;
