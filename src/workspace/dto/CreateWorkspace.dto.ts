import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class WorkSpaceDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    name: string

    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsOptional()
    description: string

    @IsString({ message: 'La URL debe ser una cadena de texto' })
    @IsOptional()
    image: string

}