/*
  Warnings:

  - The values [FEATURE_REQUEST,BACKLOG,TODO,IN_PROGRESS,IN_REVIEW,DONE] on the enum `Task_type` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `status` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `subtask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/

-- Paso 1: Crear el nuevo enum TaskStatus
CREATE TYPE "TaskStatus" AS ENUM ('BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');

-- Paso 2: Agregar columnas temporales para la migración
ALTER TABLE "Task" ADD COLUMN "status_new" "TaskStatus";
ALTER TABLE "subtask" ADD COLUMN "status_new" "TaskStatus";

-- Paso 3: Migrar datos de Task_status a TaskStatus
-- Mapeo: PENDING -> TODO, ONGOING -> IN_PROGRESS, COMPLETED -> DONE
UPDATE "Task" SET "status_new" = 
  CASE 
    WHEN "status"::text = 'PENDING' THEN 'TODO'::"TaskStatus"
    WHEN "status"::text = 'ONGOING' THEN 'IN_PROGRESS'::"TaskStatus"
    WHEN "status"::text = 'COMPLETED' THEN 'DONE'::"TaskStatus"
    ELSE 'TODO'::"TaskStatus"
  END;

UPDATE "subtask" SET "status_new" = 
  CASE 
    WHEN "status"::text = 'PENDING' THEN 'TODO'::"TaskStatus"
    WHEN "status"::text = 'ONGOING' THEN 'IN_PROGRESS'::"TaskStatus"
    WHEN "status"::text = 'COMPLETED' THEN 'DONE'::"TaskStatus"
    ELSE 'TODO'::"TaskStatus"
  END;

-- Paso 4: Eliminar columnas antiguas y renombrar
ALTER TABLE "Task" DROP COLUMN "status";
ALTER TABLE "Task" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "Task" ALTER COLUMN "status" SET NOT NULL;

ALTER TABLE "subtask" DROP COLUMN "status";
ALTER TABLE "subtask" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "subtask" ALTER COLUMN "status" SET NOT NULL;

-- Paso 5: Eliminar el enum antiguo
DROP TYPE "Task_status";

-- Paso 6: Actualizar Task_type - Mapear valores antiguos a nuevos
-- FEATURE_REQUEST -> FEATURE, BUG -> BUG, otros -> FEATURE
UPDATE "Task" SET "task_type" = 
  CASE 
    WHEN "task_type"::text = 'FEATURE_REQUEST' THEN 'FEATURE'::text
    WHEN "task_type"::text = 'BUG' THEN 'BUG'::text
    WHEN "task_type"::text IN ('BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE') THEN 'FEATURE'::text
    ELSE 'FEATURE'::text
  END::"Task_type";

-- Paso 7: Actualizar el enum Task_type
BEGIN;
CREATE TYPE "Task_type_new" AS ENUM ('FEATURE', 'BUG', 'CHORE', 'IMPROVEMENT', 'HOTFIX');
ALTER TABLE "Task" ALTER COLUMN "task_type" TYPE "Task_type_new" USING ("task_type"::text::"Task_type_new");
ALTER TYPE "Task_type" RENAME TO "Task_type_old";
ALTER TYPE "Task_type_new" RENAME TO "Task_type";
DROP TYPE "Task_type_old";
COMMIT;
