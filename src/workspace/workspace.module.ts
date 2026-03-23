import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceUploadController } from './workspace-upload.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    CloudinaryModule,
  ],
  providers: [WorkspaceService],
  controllers: [WorkspaceController, WorkspaceUploadController],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
