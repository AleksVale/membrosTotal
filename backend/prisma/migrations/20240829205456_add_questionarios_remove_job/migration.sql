/*
  Warnings:

  - You are about to drop the `job_applications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "job_applications";

-- CreateTable
CREATE TABLE "questionarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "experienciaEdicao" TEXT NOT NULL,
    "experienciaMotionGraphics" TEXT NOT NULL,
    "computador" TEXT NOT NULL,
    "programaEdicao" TEXT NOT NULL,
    "trabalhosAnteriores" TEXT NOT NULL,
    "habilidades" TEXT NOT NULL,
    "portfolio" TEXT NOT NULL,
    "disponibilidadeImediata" TEXT NOT NULL,
    "pretensaoSalarial" DOUBLE PRECISION NOT NULL,
    "disponibilidadeTempo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questionarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "questionarios_email_key" ON "questionarios"("email");
