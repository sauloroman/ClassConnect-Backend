/*
  Warnings:

  - You are about to drop the column `categoryName` on the `ClassroomCategory` table. All the data in the column will be lost.
  - Added the required column `group` to the `Classroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `ClassroomCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "group" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClassroomCategory" DROP COLUMN "categoryName",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "categoryName" "ClassroomsCategories" NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClassroomCategory" ADD CONSTRAINT "ClassroomCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
