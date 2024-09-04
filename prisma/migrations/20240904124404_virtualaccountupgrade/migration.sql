/*
  Warnings:

  - The `status` column on the `VirtualAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VirtualAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "VirtualAccount" ALTER COLUMN "balance" SET DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "VirtualAccountStatus" NOT NULL DEFAULT 'ACTIVE';
