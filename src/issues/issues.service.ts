import {
  ForbiddenException,
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIssue } from './dto/CreateIssue.dto';
import { Issue } from '@prisma/client';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}

  private generateNextCode(lastCode: string | null): string {
    if (!lastCode) return 'ISS-A00-001';

    const parts = lastCode.split('-');
    if (parts.length !== 3) return 'ISS-A00-001';

    let alphaBlock = parts[1]; // A00
    let numericPart = parseInt(parts[2], 10); // 001

    numericPart++;

    if (numericPart > 999) {
      numericPart = 1;
      // Incrementar bloque alfa (A00 -> A01)
      let letter = alphaBlock.charAt(0);
      let num = parseInt(alphaBlock.substring(1), 10);
      num++;
      if (num > 99) {
        num = 0;
        letter = String.fromCharCode(letter.charCodeAt(0) + 1);
      }
      alphaBlock = `${letter}${num.toString().padStart(2, '0')}`;
    }

    const newNumeric = numericPart.toString().padStart(3, '0');
    return `ISS-${alphaBlock}-${newNumeric}`;
  }

  async getLatestCode() : Promise<string | null> {
    try {
      const lastIssue = await this.prisma.issue.findFirst({
        orderBy: {
          createdAt: 'desc', 
        },
        select: {
          code: true,
        },
      });

      return lastIssue ? lastIssue.code : null;
    } catch (error) {
      throw new BadRequestException('Error al recuperar el último código');
    }
  }

  async createIssue(createIssueDto: CreateIssue, user: UserActiveInterface) {
    const userId = user.id;

    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const { assignedTo } = createIssueDto;
    const lastCodeData = await this.getLatestCode();
    const nextCode = this.generateNextCode(lastCodeData);

    try {
      return await this.prisma.issue.create({
        data: {
          ...createIssueDto,
          code: nextCode,
          reporterId: userId,
          assignedTo: {
            connect: assignedTo.map((userId) => ({ id: userId })),
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Error al crear el issue' + error.message);
    }
  }

  async findAll() {
    try {
      return await this.prisma.issue.findMany({
        include: {
          reporter: true,
          project: true,
          assignedTo: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error al recuperar los issues');
    }
  }

  async findOne(id: string) {
    const issue = await this.prisma.issue.findUnique({
      where: { id },
      include: {
        reporter: true,
        project: true,
        assignedTo: true,
      },
    });

    if (!issue) {
      throw new ForbiddenException('Issue no encontrado');
    }

    return issue;
  }

  async updateIssue(
    id: string,
    updateIssueDto: Partial<CreateIssue>,
    user: UserActiveInterface,
  ) {
    const userId = user.id;

    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const issue = await this.prisma.issue.findUnique({
      where: { id },
    });

    if (!issue) {
      throw new ForbiddenException('Issue no encontrado');
    }

    if (issue.reporterId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para actualizar este issue',
      );
    }

    const assignedToUpdate = updateIssueDto.assignedTo
      ? {
          assignedTo: {
            connect: updateIssueDto.assignedTo.map((assignedToId) => ({
              id: assignedToId,
            })),
          },
        }
      : {};

    try {
      return await this.prisma.issue.update({
        where: { id },
        data: {
          type: updateIssueDto.type,
          summary: updateIssueDto.summary,
          description: updateIssueDto.description,
          priority: updateIssueDto.priority,
          status: updateIssueDto.status,
          ...assignedToUpdate,
        },
        include: {
          reporter: true,
          project: true,
          assignedTo: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error al actualizar el issue');
    }
  }

  async deleteIssueById(id: string, user: UserActiveInterface) {
    const userId = user.id;

    const issue = await this.prisma.issue.findUnique({
      where: { id },
    });

    if (!issue) {
      throw new ForbiddenException('Issue no encontrado');
    }

    if (issue.reporterId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este issue',
      );
    }

    try {
      return await this.prisma.issue.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Error al eliminar el issue');
    }
  }

  async getIssuesByUser(user: UserActiveInterface) {
    const userId = user.id;

    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const issues = await this.prisma.issue.findMany({
      where: {
        reporterId: userId,
      },
      include: {
        reporter: true,
        project: true,
        assignedTo: true,
      },
    });

    if (!issues || issues.length === 0) {
      throw new NotFoundException(
        'No se encontraron issues para el usuario especificado',
      );
    }

    return issues;
  }
}
