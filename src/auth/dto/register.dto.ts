import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength, Matches, IsEmail } from "class-validator";
import { Role_User } from "@prisma/client";
import { Transform } from "class-transformer";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(8) 
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, { 
        message: 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula y un número.'
    })
    password: string;

    @IsEnum(Role_User)
    @IsNotEmpty()
    role: Role_User;
}