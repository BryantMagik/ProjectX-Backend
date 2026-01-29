import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { Role_User } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update.dto';
import { UserActiveInterface } from './interface/user-active.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const userEmail = await this.usersService.getUserByEmail(email);

    if (userEmail) throw new BadRequestException('Email ya registrado');

    const hashedPassword = await bcryptjs.hash(password, 10);

    await this.usersService.createUser({
      ...registerDto,
      password: hashedPassword,
      role: Role_User.USER,
    });

    return {
      message: 'Usuario registrado con éxito',
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) throw new UnauthorizedException('Email no registrado');

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Datos incorrectos');

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      email,
      id: user.id,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.getUserById(payload.id);

      if (!user || !user.refreshToken) {
        throw new ForbiddenException('Acceso denegado');
      }

      const refreshTokenMatches = await bcryptjs.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new ForbiddenException('Acceso denegado');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new ForbiddenException('Refresh token inválido o expirado');
    }
  }

  async logout(userId: string) {
    await this.usersService.updateUserById(userId, { refreshToken: null });
    return { message: 'Sesión cerrada correctamente' };
  }

  async profile({ email }: { email: string; role: string }) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new BadRequestException('Usuario no encontrado');

    const { password, refreshToken, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }

  async updateUser(updateUserDto: UpdateUserDto, user: UserActiveInterface) {
    const userId = user.id;

    if (!userId)
      throw new BadRequestException(
        'No existe ningun usuario con sesión iniciada',
      );

    const dbUser = await this.usersService.getUserById(userId);

    if (!dbUser) throw new BadRequestException('Usuario no encontrado en la base de datos');

    const { newPassword, oldPassword, ...otherUpdates } = updateUserDto;

    const dataToUpdate: Record<string, string> = { ...otherUpdates };

    if (newPassword) {
      if (!oldPassword) {
        throw new BadRequestException(
          'Debes proporcionar la contraseña antigua para cambiar la contraseña.',
        );
      }

      const isPasswordValid = await bcryptjs.compare(
        oldPassword,
        dbUser.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('La contraseña antigua es incorrecta.');
      }

      dataToUpdate.password = await bcryptjs.hash(newPassword, 10);
    }

    const updatedUser = await this.usersService.updateUserById(userId, dataToUpdate);

    const { password, refreshToken, ...userWithoutPassword } = updatedUser;

    return {
      message: 'Usuario actualizado con éxito',
      user: userWithoutPassword,
    };
  }

  private async generateTokens(userId: string, email: string, role: Role_User) {
    const payload = { id: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
    await this.usersService.updateUserById(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
