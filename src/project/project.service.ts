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
        const userId = user.id

        const existingProject = await this.prisma.project.findFirst({
            where: {
                OR: [
                    { name: projectDto.name },
                    { code: projectDto.code }
                ]
            }
        })

        if (existingProject) {
            throw new BadRequestException('Ya existe un proyecto con este nombre o código')
        }

        const { code, name, description, type, status, participants } = projectDto

        return await this.prisma.project.create({
            data: {
                code,
                name,
                description,
                type,
                status,
                participants: {
                    connect: participants.map(userId => ({ id: userId })),
                },
                author: {
                    connect: { id: userId },
                },
            },
        })
    }

    async getProjects() {
        return await this.prisma.project.findMany(
            {
                include: {
                    author: true,
                    participants: true,
                    taks: true,
                }
            }
        )
    }

    async getProjectByIdWhereId(user: UserActiveInterface) {
        return await this.prisma.project.findMany(
            {
                where: {
                    OR: [
                        {
                            userId: user.id
                        },
                        {
                            participants: {
                                some: {
                                    id: user.id
                                }
                            }
                        }
                    ]

                },
                include: {
                    author: true,
                    participants: true,
                    taks: true,
                }
            }
        )
    }

    async getProjectById(id: string) {
        if (!id) throw new Error('Id no encontrado')
        return await this.prisma.project.findUnique({
            where: {
                id: id
            },
            include: {
                author: true,
                participants: true,
                taks: true,
            }
        })
    }

    async getProjectByCode(code: string) {
        if (!code) throw new Error('Code no encontrado')
        return await this.prisma.project.findUnique({
            where: {
                code: code
            },
            include: {
                author: true,
                participants: true,
                taks: true,
            }
        })
    }

    async getProjectByName(name: string) {
        if (!name) throw new Error('Name no encontrado')
        return await this.prisma.project.findFirst({
            where: {
                name: name
            },
            include: {
                author: true,
                participants: true,
                taks: true,
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
    async deleteProjectByCode(code: string, user: UserActiveInterface) {
        const project = await this.getProjectByCode(code)
        if (!project) throw new BadRequestException('Proyecto no encontrado')

        if (project.userId !== user.id) {
            throw new UnauthorizedException('No tienes permiso para eliminar este proyecto', project.userId);
        }
        return this.prisma.project.delete({
            where: {
                code: code
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
