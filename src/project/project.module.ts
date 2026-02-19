import { forwardRef, Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectService } from './project.service';
import { UsersModule } from 'src/users/users.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    WorkspaceModule,
    LoggerModule,
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
