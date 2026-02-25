import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskDto } from './dto/CreateTask.dto';
import { UpdateTaskDto } from './dto/UpdateTask.dto';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { ProjectService } from 'src/project/project.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly project: ProjectService,
    private readonly user: UsersService,
  ) {}

  async createTask(
    projectId: string,
    taskDto: TaskDto,
    user: UserActiveInterface,
  ) {
    const existingProject = await this.project.getProjectById(projectId);

    if (!existingProject) throw new Error('El proyecto no existe');

    const userId = user.id;

    if (!userId) throw new Error('Usuario no autenticado');

    const dbUser = await this.user.getUserById(user.id);

    if (!dbUser) throw new Error('Usuario no encontrado en la DB');
    const { dueTime, assignedTo } = taskDto;

    await this.prisma.task.create({
      data: {
        projectId: projectId,
        name: taskDto.code,
        summary: taskDto.summary,
        description: taskDto.description,
        priority: taskDto.priority,
        task_type: taskDto.task_type,
        status: taskDto.status,
        creatorId: userId,
        dueTime:dueTime ? new Date(dueTime) : undefined,
        users: assignedTo?.length
          ? {
              connect: assignedTo.map((assignedId) => ({ id: assignedId })),
            }
          : undefined,
      },
    });
    return {
      message: 'Tarea creada',
    };
  }

  async getTotalTasksCount(): Promise<number> {
    return await this.prisma.task.count();
  }

  async getAssignedTasksCount(userId: string): Promise<number> {
    return await this.prisma.task.count({
      where: {
        users: {
          some: { id: userId },
        },
      },
    });
  }

  async getCompletedTasksCount(): Promise<number> {
    return await this.prisma.task.count({
      where: {
        status: 'DONE',
      },
    });
  }

  async getOverdueTasksCount(): Promise<number> {
    const allTasks = await this.prisma.task.findMany({
      where: {
        NOT: { status: 'DONE' },
        dueTime: { not: null },
      },
      select: {
        createdAt: true,
        dueTime: true,
      },
    });

    const now = new Date();

    // Filtramos las tareas donde la fecha de creación más el tiempo de vencimiento es menor que la fecha actual
    const overdueTasks = allTasks.filter((task) => {
      const deadline = new Date(task.createdAt.getTime() + task.dueTime.getTime());
      return deadline < now;
    });

    return overdueTasks.length;
  }

  async getTasks() {
    return this.prisma.task.findMany({
      include: {
        project: true,
        creator: true,
        users: true,
      },
    });
  }

  async getTasksByProjectId(projectId: string) {
    return await this.prisma.task.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        comments: true,
        creator: true,
        project: true,
        users: true,
      },
    });
  }

  async getTasksById(id: string) {
    if (!id) throw new Error('Id no encontrada');
    return await this.prisma.task.findUnique({
      where: {
        id: id,
      },
      include: {
        project: true,
        creator: true,
        users: true,
      },
    });
  }

  async getTaskByCode(name: string) {
    if (!name) throw new Error('Code no encontrado');

    return await this.prisma.task.findUnique({
      where: {
        name: name,
      },
      include: {
        project: true,
        creator: true,
        users: true,
      },
    });
  }

  async getTaskByIdWhereId(user: UserActiveInterface) {
    return await this.prisma.task.findMany({
      where: {
        OR: [
          {
            creatorId: user.id,
          },
          {
            users: {
              some: {
                id: user.id,
              },
            },
          },
        ],
      },
      include: {
        users: true,
        creator: true,
        comments: true,
        subtasks: true,
      },
    });
  }

  async deleteTaskByCode(name: string, user: UserActiveInterface) {
    if (!name) throw new BadRequestException('Codigo no encontrado');
    const task = await this.getTaskByCode(name);
    if (!task) throw new Error('Tarea no encontrada en la base de datos');
    if (task.creatorId !== user.id) {
      throw new UnauthorizedException(
        'No tienes permiso para eliminar este proyecto',
        task.creatorId,
      );
    }
    await this.prisma.task.delete({
      where: { name: name },
    });
  }

  async updateTask(
    id: string,
    taskDto: UpdateTaskDto,
    user: UserActiveInterface,
  ) {
    console.log('Updating task:', { id, taskDto, userId: user.id });
    
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      console.error('Task not found:', id);
      throw new Error('Tarea no encontrada');
    }

    const updateData: any = {};
    if (taskDto.summary !== undefined) updateData.summary = taskDto.summary;
    if (taskDto.description !== undefined) updateData.description = taskDto.description;
    if (taskDto.priority !== undefined) updateData.priority = taskDto.priority;
    if (taskDto.task_type !== undefined) updateData.task_type = taskDto.task_type;
    if (taskDto.status !== undefined) updateData.status = taskDto.status;
    if (taskDto.code !== undefined) updateData.name = taskDto.code;
    if (taskDto.dueTime !== undefined) {
          // Convertimos el string a un objeto Date
        updateData.dueTime = taskDto.dueTime ? new Date(taskDto.dueTime) : null;
    }
    if (taskDto.assignedTo !== undefined) {
      updateData.users = {
        set: taskDto.assignedTo.map((assignedId) => ({ id: assignedId })),
      };
    }

    console.log('Update data:', updateData);

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        creator: true,
        users: true,
      },
    });

    console.log('Task updated successfully:', updatedTask.id, updatedTask.status);
    return updatedTask;
  }

  async deleteTaskById(name: string, user: UserActiveInterface) {
    if (!name) throw new Error('Nombre no encontrado');

    return await this.prisma.task.findFirst({
      where: {
        name: name,
      },
      include: {
        project: true,
        creator: true,
        users: true,
      },
    });
  }
}
