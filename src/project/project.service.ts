import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectDto } from './dto/CreateProject.dto';

@Injectable()
export class ProjectService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async createProject(projectDto: ProjectDto, user: UserActiveInterface) {
        const userId = user.id;
        return await this.prisma.project.create({
            data: {
                ...projectDto,
                user: {
                    connect: { id: userId },
                },
            },
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

    async deleteProjectById(id: string, user: UserActiveInterface) {
        const project = await this.getProjectById(id)
        if (!project) throw new BadRequestException('Proyecto no encontrado')

        if (project.userId !== user.id) {
            throw new UnauthorizedException('No tienes permiso para eliminar este proyecto', project.userId);
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
