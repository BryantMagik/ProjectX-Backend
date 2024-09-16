import { forwardRef, Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule),forwardRef(() => UsersModule)],
  providers:[TasksService],
  controllers: [TasksController],
  exports:[TasksService]
})
export class TasksModule {}
