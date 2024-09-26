import { Body, Controller, Delete, Get, Param, Post, Put, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role_User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TasksService } from './tasks.service';
import { UsersService } from 'src/users/users.service';
import { TaskDto } from './dto/CreateTask.dto';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';


@Auth(Role_User.USER)
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
    ) { }


    @UsePipes(ValidationPipe)
    @Post()
    createTask(@Body() taskDto: TaskDto, @ActiveUser() user: UserActiveInterface, projectId: string) {
        return this.tasksService.createTask(projectId, taskDto, user)
    }

    @Get()
    async getTasks() {
        return await this.tasksService.getTasks()
    }

    @Get(':id')
    async getTaskById(@Param('id') id: string) {
        const task = await this.tasksService.getTasksById(id)
        return task
    }
    @Get(':code')
    async getTaskByCode(@Param('code') code: string) {
        const task = await this.tasksService.getTaskByCode(code)
        return task
    }
    @Delete(':id')
    deleteTaskById(@Param('id') id: string, @ActiveUser() user: UserActiveInterface) {
        return this.tasksService.deleteTaskById(id, user);
    }





}
