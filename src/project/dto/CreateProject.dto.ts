import { Project_Status, Project_Type, User } from "@prisma/client"
import { IsEnum,  IsNotEmpty, IsString } from "class-validator"

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


}