import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role_User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UsersService } from 'src/users/users.service';
import { WorkspaceService } from './workspace.service';
import { WorkSpaceDto } from './dto/CreateWorkspace.dto';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';


@Auth(Role_User.USER)
@ApiTags('Workspace')
@Controller('workspace')
export class WorkspaceController {
    constructor(
        private readonly workspaceService: WorkspaceService,
        private readonly userService: UsersService
    ) { }


    @Post()
    @UsePipes(ValidationPipe)
    createWorkspace(@Body() workspaceDto: WorkSpaceDto, @ActiveUser() user: UserActiveInterface) {
        return this.workspaceService.createWorkspace(workspaceDto, user)
    }

    @Get()
    getWorkspaces(){
        return this.workspaceService.getWorkspaces()
    }

    @Get(':id')
    async getWorkspaceById(@Param('id') id: string) {
        const workspace = await this.workspaceService.getWorkspaceById(id);
        return workspace
    }

    @Get('user/workspace')
    async getWorkspaceByIdWhereId(@ActiveUser() user: UserActiveInterface) {
        const workspaces = await this.workspaceService.getWorkspaceByIdWhereId(user)
        return workspaces
    }


}


