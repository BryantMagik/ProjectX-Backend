import { BadRequestException, Injectable } from '@nestjs/common';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkSpaceDto } from './dto/CreateWorkspace.dto';

@Injectable()
export class WorkspaceService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async createWorkspace(workspaceDto: WorkSpaceDto, user: UserActiveInterface) {
        const userId = user.id
        if (!userId) {
            throw new BadRequestException('No existe ningun usuario con sesión iniciada')
        }

        const existingWorkspace = await this.prisma.workspace.findFirst({
            where: {
                name: workspaceDto.name
            }
        })

        if (existingWorkspace) {
            throw new BadRequestException('Ya existe un Workspace con este nombre');
        }

        const workspace = await this.prisma.workspace.create({
            data: {
                name: workspaceDto.name,
                image: workspaceDto.image,
                description: workspaceDto.description,
                ownerId: userId
            }
        })
        return { message: 'Workspace creado con éxito', workspace: workspace };
    }

    async getWorkspaces() {
        return await this.prisma.workspace.findMany(
            {
                include: {
                    owner: true,
                    users: true,
                    projects: true
                }
            }
        )
    }

    async getWorkspaceById(workspaceId: string) {
        if (!workspaceId) throw new Error('Id no encontrado')

        return await this.prisma.workspace.findUnique({
            where: {
                id: workspaceId
            },
            include: {
                owner: true,
                users: true,
                projects: true
            }
        })
    }

    async getWorkspaceByIdWhereId(user: UserActiveInterface) {
        return await this.prisma.workspace.findMany(
            {
                where: {
                    OR: [
                        {
                            ownerId: user.id
                        },
                        {
                            users: {
                                some: {
                                    id: user.id
                                }
                            }
                        }
                    ]

                },
                include: {
                    users: true,
                    owner: true,
                    projects: true
                }
            }
        )
    }
}
