import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkSpaceDto } from './dto/CreateWorkspace.dto';
import { UpdateWorkspaceDto } from './dto/UpdateWorkspace.dto';
import { CreateInvitationDto } from './dto/CreateInvitation.dto';

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
        owners: true,
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
        owners: true,
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

  // Invitation methods
  async createInvitation(
    workspaceId: string,
    invitationDto: CreateInvitationDto,
    user: UserActiveInterface,
  ) {
    const workspace = await this.getWorkspaceById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace no encontrado');
    }

    // Verificar que el usuario sea el creador o un owner
    const isCreator = workspace.creatorId === user.id;
    const isOwner = workspace.owners.some((owner) => owner.id === user.id);

    if (!isCreator && !isOwner) {
      throw new ForbiddenException(
        'No tienes permiso para crear invitaciones en este workspace',
      );
    }

    // Generar código único para la invitación
    const code = `INV-${Date.now()}`;

    const invitation = await this.prisma.invitation.create({
      data: {
        code,
        workspaceId,
        authorId: user.id,
        maxUses: invitationDto.maxUses,
        expiresAt: invitationDto.expiresAt
          ? new Date(invitationDto.expiresAt)
          : null,
      },
      include: {
        workspace: true,
        author: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return {
      message: 'Invitación creada con éxito',
      invitation,
    };
  }

  async getWorkspaceInvitations(workspaceId: string, user: UserActiveInterface) {
    const workspace = await this.getWorkspaceById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace no encontrado');
    }

    // Verificar que el usuario sea miembro del workspace
    const isMember =
      workspace.creatorId === user.id ||
      workspace.owners.some((owner) => owner.id === user.id) ||
      workspace.users.some((u) => u.id === user.id);

    if (!isMember) {
      throw new ForbiddenException(
        'No tienes permiso para ver las invitaciones de este workspace',
      );
    }

    return await this.prisma.invitation.findMany({
      where: {
        workspaceId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async joinWorkspaceByToken(token: string, user: UserActiveInterface) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: {
        workspace: {
          include: {
            users: true,
            owners: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }

    // Verificar si la invitación está activa
    if (!invitation.isActive) {
      throw new BadRequestException('Esta invitación ya no está activa');
    }

    // Verificar si ha expirado
    if (invitation.expiresAt && new Date() > invitation.expiresAt) {
      throw new BadRequestException('Esta invitación ha expirado');
    }

    // Verificar si se alcanzó el máximo de usos
    if (invitation.maxUses && invitation.uses >= invitation.maxUses) {
      throw new BadRequestException(
        'Esta invitación ha alcanzado su límite de usos',
      );
    }

    // Verificar si el usuario ya es miembro
    const isAlreadyMember = invitation.workspace.users.some(
      (u) => u.id === user.id,
    );

    if (isAlreadyMember) {
      throw new BadRequestException('Ya eres miembro de este workspace');
    }

    // Agregar usuario al workspace
    await this.prisma.workspace.update({
      where: { id: invitation.workspaceId },
      data: {
        users: {
          connect: { id: user.id },
        },
      },
    });

    // Incrementar contador de usos
    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        uses: invitation.uses + 1,
      },
    });

    return {
      message: 'Te has unido al workspace exitosamente',
      workspace: invitation.workspace,
    };
  }

  async getWorkspaceMembers(workspaceId: string, user: UserActiveInterface) {
    const workspace = await this.getWorkspaceById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace no encontrado');
    }

    // Verificar que el usuario sea miembro del workspace
    const isMember =
      workspace.creatorId === user.id ||
      workspace.owners.some((owner) => owner.id === user.id) ||
      workspace.users.some((u) => u.id === user.id);

    if (!isMember) {
      throw new ForbiddenException(
        'No tienes permiso para ver los miembros de este workspace',
      );
    }

    return {
      creator: workspace.creator,
      owners: workspace.owners,
      members: workspace.users,
    };
  }

  async deactivateInvitation(invitationId: string, user: UserActiveInterface) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        workspace: {
          include: {
            owners: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }

    // Verificar que el usuario sea el creador del workspace o un owner
    const isCreator = invitation.workspace.creatorId === user.id;
    const isOwner = invitation.workspace.owners.some(
      (owner) => owner.id === user.id,
    );

    if (!isCreator && !isOwner) {
      throw new ForbiddenException(
        'No tienes permiso para desactivar esta invitación',
      );
    }

    await this.prisma.invitation.update({
      where: { id: invitationId },
      data: { isActive: false },
    });

    return { message: 'Invitación desactivada exitosamente' };
  }
}
