import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) {}

    async create(createCommentDto: CreateCommentDto, user: UserActiveInterface) {
      const userId = user.id
        return this.prisma.comment.create({
          data: {
            ...createCommentDto,
            authorId: userId,
          },
        });
    }

    async update(id: string, updateCommentDto: CreateCommentDto, user: UserActiveInterface) {
      const userId = user.id
        return this.prisma.comment.update({
          where: { id },
          data: {
            ...updateCommentDto,
            authorId: userId,
          },
        });
    }

    async findAll() {
        return this.prisma.comment.findMany({
          include: {
            author: true,
            task: true,
          },
        });
    }

    async findOne(id: string) {
        return this.prisma.comment.findUnique({
          where: { id },
          include: {
            author: true,
            task: true,
          },
        });
    }

    async deleteCommentById(id: string, user: UserActiveInterface) {
      const userId = user.id
      const comment = await this.prisma.comment.findUnique({
          where: { id },
      });

      if (!comment) {
          throw new ForbiddenException('Comentario no encontrado');
      }

      if (comment.authorId !== userId) {
          throw new ForbiddenException('No tienes permiso para eliminar este comentario');
      }

      return this.prisma.comment.delete({
          where: { id },
      });
  }


}

