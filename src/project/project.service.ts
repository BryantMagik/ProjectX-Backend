import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { UsersService } from 'src/users/users.service';
import { Project_Status } from '@prisma/client';
import { UpdateProjectDto } from './dto/UpdateProject.dto';

@Injectable()
export class ProjectService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly workspace: WorkspaceService,
        private readonly user: UsersService
    ) { }

    async createProject(workspaceId: string, projectDto: CreateProjectDto, user: UserActiveInterface) {

        const existingWorkspace = await this.workspace.getWorkspaceById(workspaceId)

        if (!existingWorkspace) throw new Error('El proyecto no existe')

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

        const dbUser = await this.user.getUserById(user.id)

        if (!dbUser) throw new Error('Usuario no encontrado en la DB')

        const { code, name, description, type, status = Project_Status.ONGOING, participants, image } = projectDto

        return await this.prisma.project.create({
            data: {
                code,
                name,
                workspaceId: existingWorkspace.id,
                description,
                image,
                type,
                status,
                authorId: userId,
                participants: {
                    connect: participants.map(userId => ({ id: userId })),
                },
            },
        })
    }

    async getProjectByWorkspaceId(workspaceId: string) {
        return await this.prisma.project.findMany(
            {
                where: {
                    workspaceId: workspaceId
                },
                include: {
                    participants: true,
                    tasks: true,
                    author: true,
                }
            }
        )
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

    async getProjectById(projectId: string) {
        if (!projectId) throw new Error('Id no encontrado')

        const project = await this.prisma.project.findUnique({
            where: {
                id: projectId
            },
            include: {
                participants: true,
                tasks: true,
                author: true,
            }
        });
        if (!project) {
            throw new NotFoundException(`Proyecto con ID ${projectId} no encontrado`);
        }

        return project

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

    async updateProjectById(id: string, newProject: UpdateProjectDto, user: UserActiveInterface) {
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
