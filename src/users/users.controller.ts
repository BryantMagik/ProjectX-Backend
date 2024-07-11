import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role_User } from '@prisma/client';

@Auth(Role_User.ADMIN)
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post()
    @UsePipes(ValidationPipe)
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        const user = await this.userService.getUserById(id);
        return user
    }

    @Get(':email')
    async getUserByEmail(@Param('email') email: string) {
        const user = await this.userService.getUserByEmail(email);
        return user
    }

    @Put(':id')
    @UsePipes(ValidationPipe)
    updateUserById(@Param('id') id: string, @Body() data) {
        return this.userService.updateUserById(id, data);
    }

    @Delete(':id')
    deleteUserById(@Param('id') id: string) {
        return this.userService.deleteUserById(id);
    }

}
