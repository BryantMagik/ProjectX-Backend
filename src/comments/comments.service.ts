import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/CreateComment.dto';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) {}

    async create(createCommentDto: CreateCommentDto) {
        return this.prisma.comment.create({
          data: {
            ...createCommentDto,
          },
        });
    }

    async update(id: string, updateCommentDto: CreateCommentDto) {
        return this.prisma.comment.update({
          where: { id },
          data: {
            ...updateCommentDto,
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


}

