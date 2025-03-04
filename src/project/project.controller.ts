import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role_User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProjectService } from './project.service';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { UpdateProjectDto } from './dto/UpdateProject.dto';


@Auth(Role_User.USER)
@ApiTags('Project')
@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
    ) { }

    @Post(':workspaceId')
    @UsePipes(ValidationPipe)
    createProject(@Param('workspaceId') workspaceId: string, @Body() projectDto: CreateProjectDto, @ActiveUser() user: UserActiveInterface) {
        return this.projectService.createProject(workspaceId, projectDto, user);
    }

    @Get()
    getProjects() {
        return this.projectService.getProjects();
    }

    @Get('workspace/:workspaceId')
    getProjectByWorkspaceId(@Param('workspaceId') workspaceId: string) {
        return this.projectService.getProjectByWorkspaceId(workspaceId);
    }

    @Get('id/:id')
    async getProjectById(@Param('id') id: string) {
        const project = await this.projectService.getProjectById(id);
        if (!project) {
            throw new NotFoundException('Proyecto no encontrado');
        }
        return project
    }

    @Get('user/projects')
    async getProjectByIdWhereId(@ActiveUser() user: UserActiveInterface) {
        const projects = await this.projectService.getProjectByIdWhereId(user)
        return projects
    }

    @Get('code/:code')
    async getProjectByCode(@Param('code') code: string) {
        const project = await this.projectService.getProjectByCode(code);
        return project
    }
    @Get('name/:name')
    async getProjectByName(@Param('name') name: string) {
        const project = await this.projectService.getProjectByName(name);
        return project
    }

    @Patch('id/:id')
    @UsePipes(ValidationPipe)
    updateProjectById(@Param('id') id: string, @Body() projectDto: Partial<UpdateProjectDto>, @ActiveUser() user: UserActiveInterface) {
        console.log('Ruta PUT alcanzada', id);
        console.log('Recibiendo datos:', projectDto);
        return this.projectService.updateProjectById(id, projectDto, user);
    }

    @Delete('id/:id')
    async deleteProjectById(@Param('id') id: string, @ActiveUser() user: UserActiveInterface) {
        return this.projectService.deleteProjectById(id, user);
    }

}
