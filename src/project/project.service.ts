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
        if (!userId) {
            throw new BadRequestException('No existe ningun usuario con sesión iniciada')

        }
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
                    participants: true,
                    tasks: true,
                    author: true
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
                            authorId: user.id
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
                    participants: true,
                    tasks: true,
                    author: true
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
                participants: true,
                tasks: true,
                author: true
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
                participants: true,
                tasks: true,
                author: true
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
                participants: true,
                tasks: true,
                author: true,
            }
        })
    }

    async deleteProjectById(id: string, user: UserActiveInterface) {
        const project = await this.getProjectById(id)
        if (!project) throw new BadRequestException('Proyecto no encontrado')

        if (project.authorId !== user.id) {
            throw new UnauthorizedException('No tienes permiso para eliminar este proyecto');
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

        if (project.authorId !== user.id) {
            throw new UnauthorizedException('No tienes permiso para eliminar este proyecto');
        }
        return this.prisma.project.delete({
            where: {
                code: code
            }
        })
    }

    async updateProjectById(id: string, newProject: ProjectDto, user: UserActiveInterface) {
        const userId = user.id

        if (!userId) throw new BadRequestException('No existe ningun usuario con sesión iniciada')

        const findProject = await this.getProjectById(id)

        if (!findProject) throw new BadRequestException('Proyecto no encontrado')

        if (findProject.authorId !== userId) throw new BadRequestException('No eres el author de este proyecto')

        const participantsUpdate = newProject.participants
            ? {
                participants: {
                    connect: newProject.participants.map(participantId => ({ id: participantId }))
                }
            }
            : {}

        return this.prisma.project.update({
            where: {
                id: id
            },
            data: {
                name: newProject.name,
                description: newProject.description,
                code: newProject.code,
                type: newProject.type,
                status: newProject.status,
                ...participantsUpdate
            }
        })
    }
}
