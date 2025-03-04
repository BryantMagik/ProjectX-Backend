import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskDto } from './dto/CreateTask.dto';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { ProjectService } from 'src/project/project.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly project: ProjectService,
        private readonly user: UsersService
    ) { }


    async createTask(projectId: string, taskDto: TaskDto, user: UserActiveInterface) {

        const existingProject = await this.project.getProjectById(projectId)

        if (!existingProject) throw new Error('El proyecto no existe')

        const userId = user.id

        if (!userId) throw new Error('Usuario no autenticado')

        const dbUser = await this.user.getUserById(user.id)

        if (!dbUser) throw new Error('Usuario no encontrado en la DB')

        await this.prisma.task.create({
            data: {
                projectId: projectId,
                name: taskDto.code,
                summary: taskDto.summary,
                description: taskDto.description,
                priority: taskDto.priority,
                task_type: taskDto.task_type,
                status: taskDto.task_status,
                creatorId: userId,
                dueTime: taskDto.dueTime ?? null
            }
        })
        return {
            message: 'Tarea creada'
        }
    }

    async getTasks() {
        return this.prisma.task.findMany({
            include: {
                project: true,
                creator: true,
                users: true,
            }
        })
    }

    async getTasksByProjectId(projectId: string) {
        return await this.prisma.task.findMany({
            where: {
                projectId: projectId
            },
            include: {
                comments: true,
                creator: true,
                project: true,
                users: true,
            }
        })
    }

    async getTasksById(id: string) {
        if (!id) throw new Error('Id no encontrada')
        return await this.prisma.task.findUnique({
            where: {
                id: id
            },
            include: {
                project: true,
                creator: true,
                users: true,
            }
        })
    }

    async getTaskByCode(name: string) {
        if (!name) throw new Error('Code no encontrado')

        return await this.prisma.task.findUnique({
            where: {
                name: name
            },
            include: {
                project: true,
                creator: true,
                users: true,
            }
        })
    }

    async getTaskByIdWhereId(user: UserActiveInterface) {
        return await this.prisma.task.findMany(
            {
                where: {
                    OR: [
                        {
                            creatorId: user.id
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
                    creator: true,
                    comments: true,
                    subtasks: true,
                }
            }
        )
    }

    async deleteTaskByCode(name: string, user: UserActiveInterface) {
        if (!name) throw new BadRequestException('Codigo no encontrado')
        const task = await this.getTaskByCode(name)
        if (!task) throw new Error('Tarea no encontrada en la base de datos')
        if (task.creatorId !== user.id) {
            throw new UnauthorizedException('No tienes permiso para eliminar este proyecto', task.creatorId);
        }
        await this.prisma.task.delete({
            where: { name: name }
        })
    }

    async deleteTaskById(name: string, user: UserActiveInterface) {
        if (!name) throw new Error('Nombre no encontrado')

        return await this.prisma.task.findFirst({
            where: {
                name: name
            },
            include: {
                project: true,
                creator: true,
                users: true,
            }
        })
    }

}
