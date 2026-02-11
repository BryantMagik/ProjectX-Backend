import { Task_priority, TaskStatus, Task_type } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsInt, Min, IsDateString } from 'class-validator';

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


  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida.' })
  @IsOptional()
  dueTime?: string;
}
