import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule), forwardRef(() => UsersModule)],
    providers: [WorkspaceService],
    controllers: [WorkspaceController],
    exports: [WorkspaceService]
})
export class WorkspaceModule { }
