import { Project_Status, Project_Type } from "@prisma/client"
import { IsArray, IsEnum,  IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator"

export class CreateProjectDto {
    @IsString({ message: 'El código debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El código no puede estar vacío.' })
    @Length(3, 10, { message: 'El código debe tener entre 3 y 50 caracteres.' })
    code: string

    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @Length(0, 255, { message: 'La descripción no puede exceder los 255 caracteres.' })
    name: string

    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsOptional()
    @Length(0, 255, { message: 'La descripción no puede exceder los 255 caracteres.' })
    description: string

    @IsString({ message: 'La URL debe ser una cadena de texto' })
    @IsOptional()
    @IsUrl({}, { message: 'La URL debe tener un formato válido.' })
    image: string

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

