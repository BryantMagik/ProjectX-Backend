import { forwardRef, Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectService } from './project.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule),forwardRef(() => UsersModule)],
    providers: [ProjectService],
    controllers: [ProjectController],
    exports: [ProjectService]
})
export class ProjectModule { }
