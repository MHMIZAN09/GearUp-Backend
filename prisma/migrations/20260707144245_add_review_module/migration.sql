/*
  Warnings:

  - A unique constraint covering the columns `[gearItemId,customerId,rentalOrderId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rentalOrderId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "rentalOrderId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Review_rentalOrderId_idx" ON "Review"("rentalOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_gearItemId_customerId_rentalOrderId_key" ON "Review"("gearItemId", "customerId", "rentalOrderId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_rentalOrderId_fkey" FOREIGN KEY ("rentalOrderId") REFERENCES "rental_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
