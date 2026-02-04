-- CreateEnum
CREATE TYPE "Project_Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "leadId" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "visibility" "Project_Visibility" NOT NULL DEFAULT 'PRIVATE';

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
