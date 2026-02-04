import { Task_priority, TaskStatus, Task_type } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Task_priority)
  @IsNotEmpty()
  priority: Task_priority;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @IsEnum(Task_type)
  @IsNotEmpty()
  task_type: Task_type;

  @IsString()
  @IsOptional()
  dueDate: string;

  @IsInt()
  @IsOptional()
  @Min(60, {
    message:
      'dueTime debe ser un número positivo, dueTime debe ser al menos 60 minutos.',
  })
  dueTime?: number;
}
