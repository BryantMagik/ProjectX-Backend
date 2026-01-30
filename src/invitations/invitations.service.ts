import { Injectable,BadRequestException,NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvitation(createInvitationDto: CreateInvitationDto, user: UserActiveInterface) {
    const userId = user.id;
    if (!userId) throw new BadRequestException('Usuario no autenticado');

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: createInvitationDto.workspaceId },
    });

    if (!workspace) throw new NotFoundException('El Workspace no existe');

    if (workspace.creatorId !== userId) {
      throw new BadRequestException('No tienes permisos para crear invitaciones en este workspace');
    }

    try {
      const code = randomBytes(4).toString('hex');

      return await this.prisma.invitation.create({
        data: {
          code,
          workspaceId: createInvitationDto.workspaceId,
          authorId: userId,
          maxUses:createInvitationDto.maxUses ?? null,
          expiresAt: createInvitationDto.expiresAt ?? null,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al generar la invitación');
    }

  }

  async acceptInvitation(code: string, user: UserActiveInterface) {
    const userId = user.id;
    if (!userId) throw new BadRequestException('Usuario no autenticado');

    const invitation = await this.prisma.invitation.findUnique({
      where: { code },
      include: { workspace: { include: { users: true } } },
    });

    if (!invitation || !invitation.isActive) {
      throw new BadRequestException('La invitación no es válida o ha sido desactivada');
    }

    if (invitation.expiresAt && new Date() > invitation.expiresAt) {
      throw new BadRequestException('La invitación ha expirado');
    }

    if (invitation.maxUses && invitation.uses >= invitation.maxUses) {
      throw new BadRequestException('La invitación ha alcanzado el máximo de usos');
    }

    const isMember = invitation.workspace.users.some((u) => u.id === userId);
    if (isMember || invitation.workspace.creatorId === userId) {
      throw new BadRequestException('Ya eres miembro de este workspace');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.workspace.update({
          where: { id: invitation.workspaceId },
          data: {
            users: { connect: { id: userId } },
          },
        });

        const updatedInvitation = await tx.invitation.update({
          where: { id: invitation.id },
          data: { uses: { increment: 1 } },
        });

        if (updatedInvitation.maxUses && updatedInvitation.uses >= updatedInvitation.maxUses) {
          await tx.invitation.update({
            where: { id: invitation.id },
            data: { isActive: false },
          });
        }

        return { message: 'Te has unido al workspace con éxito' };
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al procesar la invitación');
    }


  }

  findAll() {
    return `This action returns all invitations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invitation`;
  }

  update(id: number, updateInvitationDto: UpdateInvitationDto) {
    return `This action updates a #${id} invitation`;
  }

  async remove(id: string, user: UserActiveInterface) {
  const userId = user.id;

  const invitation = await this.prisma.invitation.findUnique({
    where: { id },
  });

  if (!invitation) throw new NotFoundException('Invitación no encontrada');

  if (invitation.authorId !== userId) {
    throw new BadRequestException('No tienes permisos para eliminar esta invitación');
  }

    try {
      return await this.prisma.invitation.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la invitación');
    }
  }
}
