import { Body, Controller, Delete, Get, Param, Post, Put, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role_User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TasksService } from './tasks.service';
import { UsersService } from 'src/users/users.service';


@Auth(Role_User.USER)
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
        private readonly userService: UsersService
    ) { }

    @UsePipes(ValidationPipe)
    @Get()
    getTasks() {
        return this.tasksService.getTasks()
    } 
    




}
