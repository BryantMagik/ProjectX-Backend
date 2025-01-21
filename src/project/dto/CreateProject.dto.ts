import { Project_Status, Project_Type } from "@prisma/client"
import { ArrayMinSize, IsArray, IsEnum,  IsNotEmpty, IsOptional, IsString } from "class-validator"

export class ProjectDto {
    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    description: string

    @IsEnum(Project_Type)
    @IsNotEmpty()
    type: Project_Type

    @IsEnum(Project_Status)
    @IsOptional()
    @IsNotEmpty()
    status: Project_Status

    @IsArray()
    @IsOptional()
    participants: string[]

}

