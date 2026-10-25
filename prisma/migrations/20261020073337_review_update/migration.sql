-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('HIDDEN', 'VISIBLE');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'VISIBLE';
