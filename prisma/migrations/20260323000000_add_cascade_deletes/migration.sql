-- AddForeignKey with CASCADE / SET NULL to allow User deletion without FK constraint violations

-- Workspace: creator → SET NULL when User deleted
ALTER TABLE "Workspace" DROP CONSTRAINT IF EXISTS "Workspace_creatorId_fkey";
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_creatorId_fkey"
  FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Project: author → CASCADE when User deleted
ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "Project_authorId_fkey";
ALTER TABLE "Project" ADD CONSTRAINT "Project_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Project: lead → SET NULL when User deleted
ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "Project_leadId_fkey";
ALTER TABLE "Project" ADD CONSTRAINT "Project_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Project: workspace → CASCADE when Workspace deleted
ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "Project_workspaceId_fkey";
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Task: creator → CASCADE when User deleted
ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_creatorId_fkey";
ALTER TABLE "Task" ADD CONSTRAINT "Task_creatorId_fkey"
  FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Task: project → CASCADE when Project deleted
ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_projectId_fkey";
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- subtask: author → CASCADE when User deleted
ALTER TABLE "subtask" DROP CONSTRAINT IF EXISTS "subtask_authorId_fkey";
ALTER TABLE "subtask" ADD CONSTRAINT "subtask_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- subtask: task → CASCADE when Task deleted
ALTER TABLE "subtask" DROP CONSTRAINT IF EXISTS "subtask_taskId_fkey";
ALTER TABLE "subtask" ADD CONSTRAINT "subtask_taskId_fkey"
  FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Comment: author → CASCADE when User deleted
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_authorId_fkey";
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Comment: task → CASCADE when Task deleted
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_taskId_fkey";
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_taskId_fkey"
  FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Comment: issue → CASCADE when Issue deleted
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_issueId_fkey";
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_issueId_fkey"
  FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Issue: project → CASCADE when Project deleted
ALTER TABLE "Issue" DROP CONSTRAINT IF EXISTS "Issue_projectId_fkey";
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Issue: reporter → CASCADE when User deleted
ALTER TABLE "Issue" DROP CONSTRAINT IF EXISTS "Issue_reporterId_fkey";
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_reporterId_fkey"
  FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Invitation: author → CASCADE when User deleted
ALTER TABLE "Invitation" DROP CONSTRAINT IF EXISTS "Invitation_authorId_fkey";
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Invitation: workspace → CASCADE when Workspace deleted
ALTER TABLE "Invitation" DROP CONSTRAINT IF EXISTS "Invitation_workspaceId_fkey";
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
