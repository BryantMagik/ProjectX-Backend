import { IsString, IsNotEmpty,IsOptional,IsEnum } from 'class-validator';
import { Task, Task_status } from '@prisma/client';

export class CreateSubtaskDto{
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(Task_status)
    status: Task_status;

    @IsString()
    taskId: string;
}