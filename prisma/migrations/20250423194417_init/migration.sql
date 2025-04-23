/*
  Warnings:

  - You are about to drop the `ClassroomQRCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassroomQRCode" DROP CONSTRAINT "ClassroomQRCode_classroomId_fkey";

-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "color" TEXT,
ADD COLUMN     "qrCode" TEXT;

-- DropTable
DROP TABLE "ClassroomQRCode";
