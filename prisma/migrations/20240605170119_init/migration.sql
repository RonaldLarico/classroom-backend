/*
  Warnings:

  - You are about to drop the column `userId` on the `Cicle` table. All the data in the column will be lost.
  - You are about to drop the column `usuario` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cicle" DROP CONSTRAINT "Cicle_userId_fkey";

-- AlterTable
ALTER TABLE "Cicle" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "usuario",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3),
ADD COLUMN     "user" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "StudentCicles" (
    "studentId" INTEGER NOT NULL,
    "cicleId" INTEGER NOT NULL,

    CONSTRAINT "StudentCicles_pkey" PRIMARY KEY ("studentId","cicleId")
);

-- AddForeignKey
ALTER TABLE "StudentCicles" ADD CONSTRAINT "StudentCicles_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCicles" ADD CONSTRAINT "StudentCicles_cicleId_fkey" FOREIGN KEY ("cicleId") REFERENCES "Cicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
