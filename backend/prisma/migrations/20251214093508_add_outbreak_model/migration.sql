-- CreateTable
CREATE TABLE "Outbreak" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "severity" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "affectedAnimals" INTEGER NOT NULL,
    "riskRadius" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Outbreak_pkey" PRIMARY KEY ("id")
);
