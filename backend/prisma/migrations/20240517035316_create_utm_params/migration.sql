-- CreateTable
CREATE TABLE "utm_params" (
    "id" SERIAL NOT NULL,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_term" TEXT,
    "utm_content" TEXT,

    CONSTRAINT "utm_params_pkey" PRIMARY KEY ("id")
);
