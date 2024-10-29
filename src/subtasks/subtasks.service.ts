import { Injectable,NotFoundException } from '@nestjs/common';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubtaskDto } from './dto/CreateSubtask.dto';

@Injectable()
export class SubtasksService {
    constructor(private prisma: PrismaService){}

    async findAll() {
        return await this.prisma.subtask.findMany();
    }

    async findOne(id: string) {
        const subtask = await this.prisma.subtask.findUnique({ 
            where: { id } ,
            include:{
                task: true
            }
        });

        if (!subtask) {
          throw new NotFoundException(`Subtask with ID ${id} not found`);
        }
        return subtask;
    }

    async create(createSubtaskDto:CreateSubtaskDto,user:UserActiveInterface){
        const userId = user.id
        return await this.prisma.subtask.create({
            data: {
              ...createSubtaskDto,
              authorId:userId,
            },
          });

    }

    async update(id:string, createSubtaskDto:Partial<CreateSubtaskDto>,user:UserActiveInterface){
        const userId = user.id

        const existingSubtask = await this.prisma.subtask.findUnique({ where: { id } });
        if (!existingSubtask) {
            throw new NotFoundException(`Subtask with ID ${id} not found`);
        }
        return await this.prisma.subtask.update({
            where: { id },
            data: {
                ...createSubtaskDto,
                authorId:userId,
            },
        });

    }


    async deleteSubtaskbyid(id:string){
        const existingSubtask = await this.prisma.subtask.findUnique({ where: { id } });

        if (!existingSubtask) {
            throw new NotFoundException(`Subtask with ID ${id} not found`);
        }
        return await this.prisma.subtask.delete({ where: { id } });

    }


}
