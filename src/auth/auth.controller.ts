import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { ApiTags } from '@nestjs/swagger'
import { Role_User } from '@prisma/client'
import { Auth } from './decorators/auth.decorator'
import { ActiveUser } from 'src/users/decorators/active-user.decorator'
import { UserActiveInterface } from './interface/user-active.interface'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Get('profile')
    @Auth(Role_User.USER)
    profile(@ActiveUser() user: UserActiveInterface) {
        return this.authService.profile(user)
    }

}
