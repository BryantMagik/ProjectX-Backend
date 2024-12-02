import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Role_User } from '@prisma/client'
import { Auth } from './decorators/auth.decorator'
import { ActiveUser } from '../users/decorators/active-user.decorator'
import { UserActiveInterface } from './interface/user-active.interface'
import { UpdateUserDto } from './dto/update.dto'

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
    
    @ApiBearerAuth()
    @Get('profile')
    @Auth(Role_User.USER)
    profile(@ActiveUser() user: UserActiveInterface) {
        return this.authService.profile(user)
    }

    @ApiBearerAuth()
    @Patch('update')
    @Auth(Role_User.USER)
    update(@ActiveUser() user: UserActiveInterface, @Body() updateUserDTO: UpdateUserDto){}

}
