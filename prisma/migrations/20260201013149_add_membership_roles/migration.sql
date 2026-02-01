/*
  Warnings:

  - You are about to drop the `_ProjectParticipants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WorkspaceMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WorkspaceOwners` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('LEAD', 'MEMBER', 'VIEWER');

-- DropForeignKey
ALTER TABLE "_ProjectParticipants" DROP CONSTRAINT "_ProjectParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectParticipants" DROP CONSTRAINT "_ProjectParticipants_B_fkey";

-- DropForeignKey
ALTER TABLE "_WorkspaceMembers" DROP CONSTRAINT "_WorkspaceMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_WorkspaceMembers" DROP CONSTRAINT "_WorkspaceMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "_WorkspaceOwners" DROP CONSTRAINT "_WorkspaceOwners_A_fkey";

-- DropForeignKey
ALTER TABLE "_WorkspaceOwners" DROP CONSTRAINT "_WorkspaceOwners_B_fkey";

-- DropTable
DROP TABLE "_ProjectParticipants";

-- DropTable
DROP TABLE "_WorkspaceMembers";

-- DropTable
DROP TABLE "_WorkspaceOwners";

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_userId_workspaceId_key" ON "WorkspaceMember"("userId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_userId_projectId_key" ON "ProjectMember"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
