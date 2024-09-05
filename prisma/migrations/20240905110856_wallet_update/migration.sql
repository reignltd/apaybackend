/*
  Warnings:

  - Added the required column `percentageCut` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetAmount` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "percentageCut" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "targetAmount" DOUBLE PRECISION NOT NULL;
