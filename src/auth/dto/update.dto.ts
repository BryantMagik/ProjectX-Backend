import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    first_name?: string

    @IsOptional()
    @IsString()
    last_name?: string

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    @MinLength(6)
    @MaxLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message: 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula y un número.',
    })
    newPassword?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Debes proporcionar la contraseña antigua para cambiar la contraseña.' })
    oldPassword?: string;

}