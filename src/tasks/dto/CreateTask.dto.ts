import { Task_priority, TaskStatus, Task_type } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
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

  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha valida.' })
  @IsOptional()
  dueTime?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assignedTo?: string[];
}

