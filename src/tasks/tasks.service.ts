import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    
    getTasks(){
        return this.prisma.taks.findMany()
    }

}
