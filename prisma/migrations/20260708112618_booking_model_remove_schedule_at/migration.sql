/*
  Warnings:

  - You are about to drop the column `scheduled_at` on the `bookings` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "bookings_scheduled_at_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "scheduled_at";
