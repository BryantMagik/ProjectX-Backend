import { Task_priority, Task_status, Task_type } from "@prisma/client";
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
    priority: Task_priority

    @IsEnum(Task_status)
    @IsNotEmpty()
    task_status: Task_status

    @IsEnum(Task_type)
    @IsNotEmpty()
    task_type: Task_type


    
}