import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIssue } from './dto/CreateIssue.dto';
import { Issue } from '@prisma/client';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';

@Injectable()
export class IssuesService {
    constructor(private prisma: PrismaService){}

    async createIssue(createIssueDto: CreateIssue,user:UserActiveInterface){
      const userId = user.id
      return this.prisma.issue.create(
        {
          data:{
            ...createIssueDto,
            reporterId:userId,
          },
        }
      );
    }

    async findAll(){
      return this.prisma.issue.findMany({
        include:{
          reporter: true,
          project: true,
        },
      });
    }

    async findOne(id: string) {
      return this.prisma.issue.findUnique({
        where: {id},
        include: {
          reporter:true,
          project:true,
        },
      });
    }

    async updateIssue(id: string, updateIssueDto: Partial<CreateIssue>,user:UserActiveInterface){
      const userId = user.id
      
      return this.prisma.issue.update({
        where:{id},
        data:{
          ...updateIssueDto,
          reporterId:userId,
        },
      });
    }

    async deleteIssueById(id: string,user:UserActiveInterface){
      const userId = user.id

      const issue = await this.prisma.issue.findUnique({
        where:{id},
      });

      if(!issue){
        throw new ForbiddenException('Issue no encontrado');
      }

      if (issue.reporterId !==userId){
        throw new ForbiddenException('No tienes permiso para elminar este issue (quien chucha te crees?)');
      }

      return this.prisma.issue.delete({
        where:{id},
      });
    }

}
