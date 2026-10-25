/*
  Warnings:

  - You are about to drop the column `profilePhoto` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "profilePhoto",
ADD COLUMN     "imagePublicId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '';
