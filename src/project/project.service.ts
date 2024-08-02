import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProjectService {
    constructor(
        private readonly usersService: UsersService,
        private prisma: PrismaService
    ) { }

    async createProject(data: Prisma.ProjectCreateInput) {

        return await this.prisma.project.create({
            data: {
                ...data,
            }
        })
    }

    getProjects() {
        return this.prisma.project.findMany()
    }

    getProjectById(id: string) {
        if (!id) throw new Error('Id no encontrado')
        return this.prisma.project.findUnique({
            where: {
                id: id
            }
        })
    }

    getProjectByCode(code: string) {
        if (!code) throw new Error('Code no encontrado')
        return this.prisma.project.findUnique({
            where: {
                code: code
            }
        })
    }

    getProjectByName(name: string) {
        if (!name) throw new Error('Name no encontrado')
        return this.prisma.project.findFirst({
            where: {
                name: name
            }
        })
    }

    async deleteProjectById(id: string, userId: string) {

        const project = await this.getProjectById(id)
        if (!project) throw new BadRequestException('Proyecto no encontrado')

        if (project.userId !== userId) {
            throw new UnauthorizedException('No tienes permiso para eliminar este proyecto');
        }
        return this.prisma.project.delete({
            where: {
                id: id
            }
        })
    }

    async updateProjectById(id: string, data: Prisma.ProjectUpdateInput) {
        const findProject = await this.getProjectById(id)
        if (!findProject) throw new BadRequestException('Proyecto no encontrado')
        return this.prisma.project.update({
            where: {
                id: id
            },
            data: {
                ...data
            }
        })
    }



}
