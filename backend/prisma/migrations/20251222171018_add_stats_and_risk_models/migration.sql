-- CreateTable
CREATE TABLE "DiseaseStatistic" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "diseaseType" TEXT NOT NULL,
    "deaths" INTEGER NOT NULL,
    "outbreaks" INTEGER NOT NULL,
    "culled" INTEGER,
    "affectedDistricts" INTEGER,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiseaseStatistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskFactor" (
    "id" TEXT NOT NULL,
    "factor" TEXT NOT NULL,
    "asfRiskMultiplier" DOUBLE PRECISION NOT NULL,
    "aiRiskMultiplier" DOUBLE PRECISION NOT NULL,
    "evidence" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskFactor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiosecurityIndicator" (
    "id" TEXT NOT NULL,
    "indicatorId" INTEGER NOT NULL,
    "variableName" TEXT NOT NULL,
    "importanceWeight" DOUBLE PRECISION NOT NULL,
    "evidenceSource" TEXT NOT NULL,
    "applicableTo" TEXT NOT NULL,
    "poorPracticePrevalence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiosecurityIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BiosecurityIndicator_indicatorId_key" ON "BiosecurityIndicator"("indicatorId");
