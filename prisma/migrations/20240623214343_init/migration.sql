/*
  Warnings:

  - You are about to drop the column `checked` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "checked";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "checked" BOOLEAN DEFAULT true;
