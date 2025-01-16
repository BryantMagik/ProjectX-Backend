import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator"

export class CreateWorkSpaceDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres.' })
    name: string

    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsOptional()
    @Length(0, 255, { message: 'La descripción no puede exceder los 255 caracteres.' })
    description: string

    @IsString({ message: 'La URL debe ser una cadena de texto' })
    @IsOptional()
    @IsUrl({}, { message: 'La URL debe tener un formato válido.' })
    image: string

}