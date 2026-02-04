import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Task, TaskStatus } from '@prisma/client';

export class CreateSubtaskDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsString()
  taskId: string;
}
