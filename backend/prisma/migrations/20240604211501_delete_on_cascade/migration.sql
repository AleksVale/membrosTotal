-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_submoduleId_fkey";

-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_trainingId_fkey";

-- DropForeignKey
ALTER TABLE "permission_user_modules" DROP CONSTRAINT "permission_user_modules_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "permission_user_modules" DROP CONSTRAINT "permission_user_modules_userId_fkey";

-- DropForeignKey
ALTER TABLE "permission_user_submodules" DROP CONSTRAINT "permission_user_submodules_submoduleId_fkey";

-- DropForeignKey
ALTER TABLE "permission_user_submodules" DROP CONSTRAINT "permission_user_submodules_userId_fkey";

-- DropForeignKey
ALTER TABLE "permission_user_trainings" DROP CONSTRAINT "permission_user_trainings_trainingId_fkey";

-- DropForeignKey
ALTER TABLE "permission_user_trainings" DROP CONSTRAINT "permission_user_trainings_userId_fkey";

-- DropForeignKey
ALTER TABLE "submodules" DROP CONSTRAINT "submodules_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "user_view_lessons" DROP CONSTRAINT "user_view_lessons_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "user_view_lessons" DROP CONSTRAINT "user_view_lessons_userId_fkey";

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submodules" ADD CONSTRAINT "submodules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_submoduleId_fkey" FOREIGN KEY ("submoduleId") REFERENCES "submodules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_view_lessons" ADD CONSTRAINT "user_view_lessons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_view_lessons" ADD CONSTRAINT "user_view_lessons_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_user_trainings" ADD CONSTRAINT "permission_user_trainings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_user_trainings" ADD CONSTRAINT "permission_user_trainings_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_user_modules" ADD CONSTRAINT "permission_user_modules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_user_modules" ADD CONSTRAINT "permission_user_modules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_user_submodules" ADD CONSTRAINT "permission_user_submodules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_user_submodules" ADD CONSTRAINT "permission_user_submodules_submoduleId_fkey" FOREIGN KEY ("submoduleId") REFERENCES "submodules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
