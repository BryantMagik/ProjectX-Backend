import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { Role_User } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

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

        const payload = { email: user.email, role: user.role }

        const token = await this.jwtService.signAsync(payload)

        return {
            token,
            email,
        }
    }

    async profile({ email, role }: { email: string; role: string }) {
        return await this.usersService.getUserByEmail(email);
    }

}
