-- CreateTable
CREATE TABLE "Runbook" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "symptom" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Runbook_pkey" PRIMARY KEY ("id")
);
