-- CreateTable
CREATE TABLE "job_applications" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "instagram" TEXT,
    "hasVideoEditingExp" BOOLEAN NOT NULL,
    "hasMotionGraphicsExp" BOOLEAN NOT NULL,
    "currentComputer" TEXT NOT NULL,
    "editingSoftware" TEXT NOT NULL,
    "previousClients" TEXT,
    "skills" TEXT NOT NULL,
    "portfolioLink" TEXT NOT NULL,
    "canStartImmediately" BOOLEAN NOT NULL,
    "salaryExpectation" TEXT NOT NULL,
    "dailyAvailability" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);
