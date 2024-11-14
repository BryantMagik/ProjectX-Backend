import { Injectable,NotFoundException,BadRequestException,UnauthorizedException,ForbiddenException } from '@nestjs/common';
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
        if (!id) {
            throw new BadRequestException('ID is required to find a subtask');
        }

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
        const userId = user.id;

        if (!createSubtaskDto || !userId) {
            throw new BadRequestException('Required data is missing');
        }

        return await this.prisma.subtask.create({
            data: {
              ...createSubtaskDto,
              authorId:userId,
            },
          });

    }

    async update(id:string, createSubtaskDto:Partial<CreateSubtaskDto>,user:UserActiveInterface){
        const userId = user.id;

        if (!id) {
            throw new BadRequestException('ID is required to update a subtask');
        }

        const existingSubtask = await this.prisma.subtask.findUnique({ where: { id } });
        if (!existingSubtask) {
            throw new NotFoundException(`Subtask with ID ${id} not found`);
        }
        
        if (existingSubtask.authorId !== userId) {
            throw new ForbiddenException('You do not have permission to update this subtask');
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

        if (!id) {
            throw new BadRequestException('ID is required to delete a subtask');
        }

        const existingSubtask = await this.prisma.subtask.findUnique({ where: { id } });

        if (!existingSubtask) {
            throw new NotFoundException(`Subtask with ID ${id} not found`);
        }
        return await this.prisma.subtask.delete({ where: { id } });

    }

    async getSubtasksByUser(user:UserActiveInterface){

        if (!user || !user.id) {
            throw new UnauthorizedException('User is not authenticated or user ID is missing');
        }

        const subtasks = await this.prisma.subtask.findMany({
            where:{
                authorId:user.id
            },
            include:{
                task:true
            }

        });
        
        if (!subtasks || subtasks.length === 0) {
            throw new NotFoundException('No subtasks found for the specified user');
        }

        return subtasks;
    }


}
