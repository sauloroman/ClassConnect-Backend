/*
  Warnings:

  - Changed the type of `categoryName` on the `Categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "categoryName",
ADD COLUMN     "categoryName" TEXT NOT NULL;
