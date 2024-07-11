import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async createUser(data: Prisma.UserCreateInput) {

        return await this.prisma.user.create({
            data: {
                ...data,
            }
        })
    }

     getUsers() {
        return this.prisma.user.findMany()
    }

    getUserById(id: string) {
        if (!id) throw new Error('Id no encontrado')
        return this.prisma.user.findUnique({
            where: {
                id: id
            }
        })
    }

    getUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email: email
            }
        })
    }


    async deleteUserById(id: string) {
        const findUser = await this.getUserById(id)
        if (!findUser) throw new BadRequestException('Usuario no encontrado')

        return this.prisma.user.delete({
            where: {
                id: id
            }
        })
    }

    async updateUserById(id: string, data: Prisma.UserUpdateInput) {
        const findUser = await this.getUserById(id)
        if (!findUser) throw new BadRequestException('Usuario no encontrado')
        return this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                ...data
            }
        })
    }

}
