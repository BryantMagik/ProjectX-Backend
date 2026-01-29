import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkSpaceDto } from './dto/CreateWorkspace.dto';
import { UpdateWorkspaceDto } from './dto/UpdateWorkspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkspace(
    workspaceDto: CreateWorkSpaceDto,
    user: UserActiveInterface,
  ) {
    const userId = user.id;
    if (!userId) {
      throw new BadRequestException(
        'No existe ningun usuario con sesión iniciada',
      );
    }

    const existingWorkspace = await this.prisma.workspace.findFirst({
      where: {
        name: workspaceDto.name,
      },
    });

    if (existingWorkspace) {
      throw new BadRequestException('Ya existe un Workspace con este nombre');
    }

    const workspace = await this.prisma.workspace.create({
      data: {
        name: workspaceDto.name,
        image: workspaceDto.image,
        description: workspaceDto.description,
        creatorId: userId,
      },
    });
    return { message: 'Workspace creado con éxito', workspace: workspace };
  }

  async getWorkspaces() {
    return await this.prisma.workspace.findMany({
      include: {
        creator: true,
        users: true,
        projects: true,
      },
    });
  }

  async getWorkspaceById(workspaceId: string) {
    if (!workspaceId) throw new Error('Id no encontrado');

    return await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        creator: true,
        users: true,
        projects: true,
      },
    });
  }

  async getWorkspaceByIdWhereId(user: UserActiveInterface) {
    return await this.prisma.workspace.findMany({
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
        projects: true,
      },
    });
  }

  async updateWorkspace(
    workspaceId: string,
    workspaceDto: UpdateWorkspaceDto,
    user: UserActiveInterface,
  ) {
    const userId = user.id;

    if (!userId)
      throw new BadRequestException(
        'No existe ningun usuario con sesión iniciada',
      );

    const findWorkspace = await this.getWorkspaceById(workspaceId);

    if (!findWorkspace)
      throw new BadRequestException('No existe ningun workspace con este id');

    if (findWorkspace.creatorId !== userId)
      throw new BadRequestException(
        'No tienes permiso para editar este Workspace',
      );

    const hasChanges = Object.keys(workspaceDto).length > 0;

    if (!hasChanges) {
      throw new BadRequestException(
        'No se proporcionaron cambios para actualizar',
      );
    }

    try {
      return this.prisma.workspace.update({
        where: {
          id: workspaceId,
        },
        data: {
          ...workspaceDto,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar el Workspace',
      );
    }
  }

  async deleteWorkspace(id: string, user: UserActiveInterface) {
    const userId = user.id;
    if (!userId)
      throw new BadRequestException(
        'No existe ningun usuario con sesión iniciada',
      );

    const workspace = await this.getWorkspaceById(id);

    if (!workspace)
      throw new BadRequestException('No existe ningun workspace con este id');

    if (workspace.creatorId !== userId)
      throw new BadRequestException(
        'No tienes permiso para eliminar este workspace',
      );

    try {
      return this.prisma.workspace.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al eliminar el Workspace',
      );
    }
  }
}
