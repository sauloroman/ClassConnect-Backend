-- CreateTable
CREATE TABLE "ClassroomQRCode" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "classroomId" TEXT NOT NULL,

    CONSTRAINT "ClassroomQRCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomQRCode_classroomId_key" ON "ClassroomQRCode"("classroomId");

-- AddForeignKey
ALTER TABLE "ClassroomQRCode" ADD CONSTRAINT "ClassroomQRCode_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
