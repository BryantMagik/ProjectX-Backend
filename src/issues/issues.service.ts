import { ForbiddenException, Injectable, BadRequestException, UnauthorizedException,NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIssue } from './dto/CreateIssue.dto';
import { Issue } from '@prisma/client';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';

@Injectable()
export class IssuesService {
    constructor(private prisma: PrismaService){}

    async createIssue(createIssueDto: CreateIssue,user:UserActiveInterface){
      const userId = user.id

      if (!userId) {
        throw new UnauthorizedException('Usuario no autenticado');
      }

      try {
        return await this.prisma.issue.create({
          data: {
            ...createIssueDto,
            reporterId: userId,
          },
        });
      } catch (error) {
        throw new BadRequestException('Error al crear el issue');
      }
    }

    async findAll(){
      try {
        return await this.prisma.issue.findMany({
          include: {
            reporter: true,
            project: true,
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
        },
      });
  
      if (!issue) {
        throw new ForbiddenException('Issue no encontrado');
      }
  
      return issue;
    }

    async updateIssue(id: string, updateIssueDto: Partial<CreateIssue>,user:UserActiveInterface){
      const userId = user.id

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
        throw new ForbiddenException('No tienes permiso para actualizar este issue');
      }
  
      try {
        return await this.prisma.issue.update({
          where: { id },
          data: {
            ...updateIssueDto,
            reporterId: userId,
          },
        });
      } catch (error) {
        throw new BadRequestException('Error al actualizar el issue');
      }
    }

    async deleteIssueById(id: string,user:UserActiveInterface){
      const userId = user.id

      const issue = await this.prisma.issue.findUnique({
        where: { id },
      });
  
      if (!issue) {
        throw new ForbiddenException('Issue no encontrado');
      }
  
      if (issue.reporterId !== userId) {
        throw new ForbiddenException('No tienes permiso para eliminar este issue');
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
          project: true
        },
      });
  
      if (!issues || issues.length === 0) {
        throw new NotFoundException('No se encontraron issues para el usuario especificado');
      }
  
      return issues;
    }
}
