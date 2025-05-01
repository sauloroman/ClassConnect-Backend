-- CreateEnum
CREATE TYPE "ClassroomsCategories" AS ENUM ('matemáticas', 'idiomas', 'ciencia', 'ingeniería', 'humanidades', 'economía', 'arte');

-- CreateTable
CREATE TABLE "ClassroomCategory" (
    "id" TEXT NOT NULL,
    "categoryName" "ClassroomsCategories" NOT NULL,
    "classroomId" TEXT NOT NULL,

    CONSTRAINT "ClassroomCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClassroomCategory" ADD CONSTRAINT "ClassroomCategory_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
