-- AlterTable
ALTER TABLE "Farm" ADD COLUMN     "animalCount" INTEGER,
ADD COLUMN     "establishmentDate" TIMESTAMP(3),
ADD COLUMN     "infrastructure" TEXT,
ADD COLUMN     "livestockType" TEXT,
ADD COLUMN     "registrationNumber" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';
