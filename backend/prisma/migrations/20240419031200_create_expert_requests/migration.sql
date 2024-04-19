-- CreateTable
CREATE TABLE "expert_requests" (
    "id" SERIAL NOT NULL,
    "instagram" TEXT NOT NULL,
    "youtube" TEXT,
    "platforms" TEXT NOT NULL,
    "hasProduct" TEXT NOT NULL,
    "invoiced" DOUBLE PRECISION NOT NULL,
    "productLink" TEXT,
    "budget" DOUBLE PRECISION NOT NULL,
    "compromised" TEXT NOT NULL,
    "searching" TEXT NOT NULL,
    "diferential" TEXT NOT NULL,
    "extraInfo" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_requests_pkey" PRIMARY KEY ("id")
);
