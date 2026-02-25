import { Task_priority, TaskStatus, Task_type } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Task_priority)
  @IsOptional()
  priority?: Task_priority;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(Task_type)
  @IsOptional()
  task_type?: Task_type;

  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha valida.' })
  @IsOptional()
  dueTime?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assignedTo?: string[];
}

