import { Body, Controller, Delete, Get, Param, Post, Put, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role_User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProjectService } from './project.service';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';
import { ProjectDto } from './dto/CreateProject.dto';
import { UsersService } from 'src/users/users.service';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';


@Auth(Role_User.USER)
@ApiTags('Project')
@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly userService: UsersService
    ) { }

    @Post()
    @UsePipes(ValidationPipe)
    createProject(@Body() projectDto: ProjectDto, @ActiveUser() user: UserActiveInterface) {
        console.log(user)
        return this.projectService.createProject(projectDto, user);
    }

    @Get()
    getProjects() {
        return this.projectService.getProjects();
    }

    @Get(':id')
    async getProjectById(@Param('id') id: string) {
        const project = await this.projectService.getProjectById(id);
        return project
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
    updateProjectById(@Param('id') id: string, @Body() data) {
        return this.projectService.updateProjectById(id, data);
    }

    @Delete(':id')
    deleteProjectById(@Param('id') id: string, @ActiveUser() user: UserActiveInterface) {
        return this.projectService.deleteProjectById(id, user);
    }

}
