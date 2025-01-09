import { ForbiddenException, Injectable,BadRequestException,UnauthorizedException,NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) {}

    async create(createCommentDto: CreateCommentDto, user: UserActiveInterface) {
      const userId = user.id
      const { taskId, issueId } = createCommentDto;

      if (!userId) {
        throw new UnauthorizedException('Usuario no autorizado.');
      }

      if (!taskId && !issueId) {
        throw new BadRequestException('Debe especificar un taskId o un issueId');
      }

      if (taskId && issueId) {
        throw new BadRequestException('Solo puede especificar taskId o issueId, no ambos');
      }

      return this.prisma.comment.create({
        data: {
          body: createCommentDto.body,
          authorId: userId,
          taskId: taskId || null,
          issueId: issueId || null,
        },
      });
    }

    async update(id: string, updateCommentDto: Partial<CreateCommentDto>, user: UserActiveInterface) {
      const userId = user.id
      const comment = await this.prisma.comment.findUnique({ where: { id } });

      if (!comment) {
        throw new BadRequestException('Comentario no encontrado');
      }

      if (!userId) {
        throw new UnauthorizedException('Usuario no autorizado.');
      }

      if (comment.authorId !== userId) {
        throw new ForbiddenException('No tienes permiso para actualizar este comentario');
      }
      return this.prisma.comment.update({
        where: { id },
        data: {
          body: updateCommentDto.body,
        },
      });
    }

    async findAll() {
        return this.prisma.comment.findMany({
          include: {
            author: true,
            task: true,
            issue: true,
          },
        });
    }

    async findOne(id: string) {
        if (!id) throw new Error('Id no encontrado')
        return this.prisma.comment.findUnique({
          where: { id },
          include: {
            author: true,
            task: true,
            issue: true,
          },
        });
    }

    async deleteCommentById(id: string, user: UserActiveInterface) {
      const userId = user.id
      const comment = await this.prisma.comment.findUnique({
          where: { id },
      });

      if (!comment) {
        throw new BadRequestException('Comentario no encontrado');
      }

      if (!userId) {
        throw new UnauthorizedException('Usuario no autorizado.');
      }

      if (comment.authorId !== userId) {
          throw new ForbiddenException('No tienes permiso para eliminar este comentario');
      }

      return this.prisma.comment.delete({
          where: { id },
      });
  }

  async getCommentsByUser(user:UserActiveInterface){

    if (!user || !user.id) {
      throw new UnauthorizedException('Usuario no autenticado o ID de usuario faltante.');
    }

    const comments = await this.prisma.comment.findMany({
      where:{
        authorId:user.id
      },
      include:{
        author: true,
        task: true,
        issue: true,
      }
    });

    if (!comments || comments.length === 0) {
      throw new NotFoundException('No se encontraron comentarios para el usuario especificado.');
    }

    return comments;


  }

  async findCommentsByTask(taskId: string) {
    if (!taskId) {
        throw new BadRequestException('Debe proporcionar un taskId válido');
    }

    const comments = await this.prisma.comment.findMany({
        where: { taskId },
        orderBy: { date: 'desc' }, // Ordenar por fecha descendente
        include: { author: true },
    });

    if (!comments || comments.length === 0) {
        throw new NotFoundException(`No se encontraron comentarios para la tarea con ID ${taskId}`);
    }

    return comments;
  }

  async findCommentsByIssue(issueId: string) {
    if (!issueId) {
        throw new BadRequestException('Debe proporcionar un issueId válido');
    }

    const comments = await this.prisma.comment.findMany({
        where: { issueId },
        orderBy: { date: 'desc' }, // Ordenar por fecha descendente
        include: { author: true },
    });

    if (!comments || comments.length === 0) {
        throw new NotFoundException(`No se encontraron comentarios para el issue con ID ${issueId}`);
    }

    return comments;
  }



}

