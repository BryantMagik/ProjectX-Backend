import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  isArray,
  IsArray,
} from 'class-validator';
import { IssueType, Task_priority, IssueStatus } from '@prisma/client';

export class CreateIssue {
  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(IssueType)
  @IsNotEmpty()
  type: IssueType;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Task_priority)
  @IsNotEmpty()
  priority: Task_priority;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsEnum(IssueStatus)
  @IsNotEmpty()
  status: IssueStatus;

  @IsArray()
  assignedTo: string[];
}
