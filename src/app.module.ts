import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsModule } from './comments/comments.module';
import { IssuesService } from './issues/issues.service';
import { IssuesController } from './issues/issues.controller';
import { IssuesModule } from './issues/issues.module';
import { SubtasksService } from './subtasks/subtasks.service';
import { SubtasksController } from './subtasks/subtasks.controller';
import { SubtasksModule } from './subtasks/subtasks.module';
import { WorkspaceService } from './workspace/workspace.service';
import { WorkspaceController } from './workspace/workspace.controller';
import { WorkspaceModule } from './workspace/workspace.module';
import { LoggerModule } from './logger/logger.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    ProjectModule,
    TasksModule,
    CommentsModule,
    IssuesModule,
    SubtasksModule,
    WorkspaceModule,
  ],
  controllers: [
    AppController,
    CommentsController,
    IssuesController,
    SubtasksController,
    WorkspaceController,
  ],
  providers: [
    AppService,
    CommentsService,
    IssuesService,
    SubtasksService,
    WorkspaceService,
  ],
})
export class AppModule {}
