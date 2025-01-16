import { Body, Controller, Delete, Get, Param, Post, Put, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role_User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProjectService } from './project.service';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';
import { ProjectDto } from './dto/CreateProject.dto';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';


@Auth(Role_User.USER)
@ApiTags('Project')
@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
    ) { }

    @Post()
    @UsePipes(ValidationPipe)
    createProject(@Param('workspaceId') workspaceId: string, @Body() projectDto: ProjectDto, @ActiveUser() user: UserActiveInterface) {
        return this.projectService.createProject(workspaceId, projectDto, user);
    }

    @Get()
    getProjects() {
        return this.projectService.getProjects();
    }

    @Get(':workspaceId')
    getProjectByWorkspaceId(@Param('workspaceId') workspaceId: string) {
        return this.projectService.getProjectByWorkspaceId(workspaceId);
    }

    @Get(':id')
    async getProjectById(@Param('id') id: string) {
        const project = await this.projectService.getProjectById(id);
        return project
    }

    @Get('user/projects')
    async getProjectByIdWhereId(@ActiveUser() user: UserActiveInterface) {
        const projects = await this.projectService.getProjectByIdWhereId(user)
        return projects

    }

    @Get(':code')
    async getProjectByCode(@Param('code') code: string) {
        const project = await this.projectService.getProjectByCode(code);
        return project
    }
    @Get(':name')
    async getProjectByName(@Param('name') name: string) {
        const project = await this.projectService.getProjectByName(name);
        return project
    }

    @Put(':id')
    @UsePipes(ValidationPipe)
    updateProjectById(@Param('id') id: string, @Body() projectDto: ProjectDto, @ActiveUser() user: UserActiveInterface) {
        console.log('Ruta PUT alcanzada', id);
        console.log('Recibiendo datos:', projectDto);
        return this.projectService.updateProjectById(id, projectDto, user);
    }

    @Delete(':id')
    async deleteProjectById(@Param('id') id: string, @ActiveUser() user: UserActiveInterface) {
        return this.projectService.deleteProjectById(id, user);
    }

    @Delete(':id')
    deleteProjectByCode(@Param('id') code: string, @ActiveUser() user: UserActiveInterface) {
        return this.projectService.deleteProjectById(code, user);
    }

}
