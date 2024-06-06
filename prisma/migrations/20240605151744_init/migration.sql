-- DropForeignKey
ALTER TABLE "GroupCourses" DROP CONSTRAINT "GroupCourses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "GroupCourses" DROP CONSTRAINT "GroupCourses_groupId_fkey";

-- DropForeignKey
ALTER TABLE "StudentOnCourses" DROP CONSTRAINT "StudentOnCourses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "StudentOnCourses" DROP CONSTRAINT "StudentOnCourses_studentId_fkey";

-- AddForeignKey
ALTER TABLE "GroupCourses" ADD CONSTRAINT "GroupCourses_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupCourses" ADD CONSTRAINT "GroupCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentOnCourses" ADD CONSTRAINT "StudentOnCourses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentOnCourses" ADD CONSTRAINT "StudentOnCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
