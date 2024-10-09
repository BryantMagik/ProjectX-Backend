import { Project_Status, Project_Type } from "@prisma/client"
import { ArrayMinSize, IsArray, IsEnum,  IsNotEmpty, IsString } from "class-validator"

export class ProjectDto {
    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsEnum(Project_Type)
    @IsNotEmpty()
    type: Project_Type

    @IsEnum(Project_Status)
    @IsNotEmpty()
    status: Project_Status

    @IsArray()
    participants: string[]

    // @IsString()
    // authorId: string
}