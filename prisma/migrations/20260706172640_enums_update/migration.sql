/*
  Warnings:

  - The values [REFUNDED,CANCELED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PAID,PICKED_UP,RETURNED,CANCELED,CONFIRMED] on the enum `RentalOrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');
ALTER TABLE "public"."payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RentalOrderStatus_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED', 'REFUNDED');
ALTER TABLE "public"."rental_orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "rental_orders" ALTER COLUMN "status" TYPE "RentalOrderStatus_new" USING ("status"::text::"RentalOrderStatus_new");
ALTER TYPE "RentalOrderStatus" RENAME TO "RentalOrderStatus_old";
ALTER TYPE "RentalOrderStatus_new" RENAME TO "RentalOrderStatus";
DROP TYPE "public"."RentalOrderStatus_old";
ALTER TABLE "rental_orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
