import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role_User, User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TasksService } from './tasks.service';
import { TaskDto } from './dto/CreateTask.dto';
import { UpdateTaskDto } from './dto/UpdateTask.dto';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';

@Auth(Role_User.USER)
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UsePipes(ValidationPipe)
  @Post(':projectId')
  createTask(
    @Param('projectId') projectId: string,
    @Body() taskDto: TaskDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.tasksService.createTask(projectId, taskDto, user);
  }

  @Get()
  async getTasks() {
    return await this.tasksService.getTasks();
  }

  @Get('project/:projectId')
  async getTaskByProjectId(@Param('projectId') projectId: string) {
    return this.tasksService.getTasksByProjectId(projectId);
  }

  @Get('user/tasks')
  async getTaskByIdWhereId(@ActiveUser() user: UserActiveInterface) {
    const tasks = await this.tasksService.getTaskByIdWhereId(user);
    return tasks;
  }

  @Get('id/:id')
  async getTaskById(@Param('id') id: string) {
    const task = await this.tasksService.getTasksById(id);
    return task;
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() taskDto: UpdateTaskDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.tasksService.updateTask(id, taskDto, user);
  }

  @Get(':code')
  async getTaskByCode(@Param('code') code: string) {
    const task = await this.tasksService.getTaskByCode(code);
    return task;
  }

  @Delete(':id')
  deleteTaskById(
    @Param('id') id: string,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.tasksService.deleteTaskById(id, user);
  }
}
