import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { Role_User } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update.dto';
import { UserActiveInterface } from './interface/user-active.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password } = registerDto;

        const userEmail = await this.usersService.getUserByEmail(email)

        if (userEmail) throw new BadRequestException('Email ya registrado')

        const hashedPassword = await bcryptjs.hash(password, 10)

        await this.usersService.createUser({
            ...registerDto,
            password: hashedPassword,
            role: Role_User.USER
        })

        return {
            message: 'Usuario registrado con éxito'
        }
    }

    async login({ email, password }: LoginDto) {

        const user = await this.usersService.getUserByEmail(email)

        if (!user) throw new UnauthorizedException('Email no registrado')

        const isPasswordValid = await bcryptjs.compare(password, user.password)

        if (!isPasswordValid) throw new UnauthorizedException('Datos incorrectos')

        const payload = { email: user.email, role: user.role, id: user.id }

        const token = await this.jwtService.signAsync(payload)

        return {
            token,
            email,
            id: user.id
        }
    }

    async profile({ email, role }: { email: string; role: string }) {
        return await this.usersService.getUserByEmail(email);
    }

    async updateUser(updateUserDto: UpdateUserDto, user: UserActiveInterface) {

        const userId = user.id

        if (!userId) throw new BadRequestException('No existe ningun usuario con sesión iniciada')


        const dbUser = await this.usersService.getUserById(user.id)

        if (!dbUser) throw new Error('Usuario no encontrado en la base de datos')
        
        const { newPassword, oldPassword, ...otherUpdates } = updateUserDto

        if(newPassword && oldPassword){

            const isPasswordValid = await bcryptjs.compare(oldPassword, dbUser.password)

            if(!isPasswordValid) {
                throw new UnauthorizedException('La contraseña antigua es incorrecta.');
            }

        }


    }
}
