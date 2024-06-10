/*
  Warnings:

  - You are about to drop the column `zip` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `house` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('home', 'work', 'other');

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "zip",
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deliveryDays" TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']::TEXT[],
ADD COLUMN     "house" TEXT NOT NULL,
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "pincode" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'home',
ALTER COLUMN "street" DROP NOT NULL;
