import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role_User } from '@prisma/client';
import { ActiveUser } from './decorators/active-user.decorator';
import { UserActiveInterface } from '../auth/interface/user-active.interface';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // ============ ADMIN ONLY ENDPOINTS ============

  @Auth(Role_User.ADMIN)
  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Auth(Role_User.USER)
  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Auth(Role_User.USER)
  @Get('admins')
  async getAdmins() {
    return await this.userService.getAdmins();
  }

  @Auth(Role_User.ADMIN)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Auth(Role_User.ADMIN)
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }

  @Auth(Role_User.ADMIN)
  @Patch('admin/:id')
  @UsePipes(ValidationPipe)
  async updateUserByAdmin(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUserById(id, updateUserDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Auth(Role_User.ADMIN)
  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }

  // ============ USER ENDPOINTS (with ownership check) ============

  @Auth(Role_User.USER)
  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @ActiveUser() currentUser: UserActiveInterface,
  ) {
    // Verificar que el usuario solo puede modificar su propio perfil
    if (currentUser.id !== id) {
      throw new ForbiddenException('No tienes permiso para modificar este usuario');
    }

    const user = await this.userService.updateUserById(id, updateUserDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
