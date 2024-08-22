/*
  Warnings:

  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('BVN', 'NIN', 'PHONENUMBER');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;

-- CreateTable
CREATE TABLE "VerificationBank" (
    "id" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL,
    "number" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verificationBankId" TEXT NOT NULL,

    CONSTRAINT "VerificationEnrollment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VerificationEnrollment" ADD CONSTRAINT "VerificationEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationEnrollment" ADD CONSTRAINT "VerificationEnrollment_verificationBankId_fkey" FOREIGN KEY ("verificationBankId") REFERENCES "VerificationBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
