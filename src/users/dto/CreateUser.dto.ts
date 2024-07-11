import { Role_User } from "@prisma/client"
import { Transform } from "class-transformer"
import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    first_name: string

    @IsString()
    @IsNotEmpty()
    last_name: string

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()
    @MaxLength(8)
    password: string

    @IsEnum(Role_User)
    @IsNotEmpty()
    role: Role_User;
}