/*
  Warnings:

  - The values [IN_PROGRESS,COMPLETED,FAILED,REFUNDED] on the enum `RentalOrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `imageUrl` column on the `gear_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RentalOrderStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'PICKED_UP', 'RETURNED', 'CANCELLED');
ALTER TABLE "public"."rental_orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "rental_orders" ALTER COLUMN "status" TYPE "RentalOrderStatus_new" USING ("status"::text::"RentalOrderStatus_new");
ALTER TYPE "RentalOrderStatus" RENAME TO "RentalOrderStatus_old";
ALTER TYPE "RentalOrderStatus_new" RENAME TO "RentalOrderStatus";
DROP TYPE "public"."RentalOrderStatus_old";
ALTER TABLE "rental_orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "rental_order_items" DROP CONSTRAINT "rental_order_items_rentalOrderId_fkey";

-- DropIndex
DROP INDEX "gear_items_providerId_categoryId_idx";

-- DropIndex
DROP INDEX "gear_items_status_idx";

-- DropIndex
DROP INDEX "payments_rentalOrderId_key";

-- DropIndex
DROP INDEX "users_email_idx";

-- AlterTable
ALTER TABLE "gear_items" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "gearItemId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_gearItemId_idx" ON "Review"("gearItemId");

-- CreateIndex
CREATE INDEX "Review_customerId_idx" ON "Review"("customerId");

-- CreateIndex
CREATE INDEX "gear_items_providerId_idx" ON "gear_items"("providerId");

-- CreateIndex
CREATE INDEX "gear_items_categoryId_idx" ON "gear_items"("categoryId");

-- AddForeignKey
ALTER TABLE "rental_order_items" ADD CONSTRAINT "rental_order_items_rentalOrderId_fkey" FOREIGN KEY ("rentalOrderId") REFERENCES "rental_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_gearItemId_fkey" FOREIGN KEY ("gearItemId") REFERENCES "gear_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
