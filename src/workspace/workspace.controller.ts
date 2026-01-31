import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role_User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UsersService } from 'src/users/users.service';
import { WorkspaceService } from './workspace.service';
import { CreateWorkSpaceDto } from './dto/CreateWorkspace.dto';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { CreateInvitationDto } from './dto/CreateInvitation.dto';
import { JoinWorkspaceDto } from './dto/JoinWorkspace.dto';

@Auth(Role_User.USER)
@ApiTags('Workspace')
@Controller('workspace')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  createWorkspace(
    @Body() workspaceDto: CreateWorkSpaceDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.workspaceService.createWorkspace(workspaceDto, user);
  }

  @Get()
  getWorkspaces() {
    return this.workspaceService.getWorkspaces();
  }

  @Get(':id')
  async getWorkspaceById(@Param('id') id: string) {
    const workspace = await this.workspaceService.getWorkspaceById(id);
    return workspace;
  }

  @Get('user/workspace')
  async getWorkspaceByIdWhereId(@ActiveUser() user: UserActiveInterface) {
    const workspaces =
      await this.workspaceService.getWorkspaceByIdWhereId(user);
    return workspaces;
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updateWorkspace(
    @Param('id') id: string,
    @Body() workspaceDto: CreateWorkSpaceDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.workspaceService.updateWorkspace(id, workspaceDto, user);
  }

  @Delete(':id')
  async deleteWorkspace(
    @Param('id') id: string,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.workspaceService.deleteWorkspace(id, user);
  }

  // Invitation endpoints
  @Post(':workspaceId/invitations')
  @UsePipes(ValidationPipe)
  async createInvitation(
    @Param('workspaceId') workspaceId: string,
    @Body() invitationDto: CreateInvitationDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.workspaceService.createInvitation(
      workspaceId,
      invitationDto,
      user,
    );
  }

  @Get(':workspaceId/invitations')
  async getWorkspaceInvitations(
    @Param('workspaceId') workspaceId: string,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.workspaceService.getWorkspaceInvitations(workspaceId, user);
  }

  @Post('join')
  @UsePipes(ValidationPipe)
  async joinWorkspaceByToken(
    @Body() joinDto: JoinWorkspaceDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.workspaceService.joinWorkspaceByToken(joinDto.token, user);
  }

  @Get(':workspaceId/members')
  async getWorkspaceMembers(
    @Param('workspaceId') workspaceId: string,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.workspaceService.getWorkspaceMembers(workspaceId, user);
  }

  @Patch('invitations/:invitationId/deactivate')
  async deactivateInvitation(
    @Param('invitationId') invitationId: string,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.workspaceService.deactivateInvitation(invitationId, user);
  }

  @Delete(':workspaceId/members/:userId')
  async removeMember(
    @Param('workspaceId') workspaceId: string,
    @Param('userId') userId: string,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.workspaceService.removeMemberFromWorkspace(workspaceId, userId, user);
  }
}
