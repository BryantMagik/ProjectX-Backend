import { Task_priority, Task_status } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class TaskDto {

    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    sumary: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsEnum(Task_priority)
    @IsNotEmpty()
    task_priority: Task_priority

    @IsEnum(Task_status)
    @IsNotEmpty()
    status: Task_status

    
}