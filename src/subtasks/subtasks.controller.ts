import { Controller,Get,Post,Param,Patch,Delete, Body } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto } from './dto/CreateSubtask.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Role_User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';
import { get } from 'http';

@Auth(Role_User.USER)
@ApiTags("Subtasks")
@Controller('subtasks')
export class SubtasksController {
    constructor (private readonly subtaskService:SubtasksService,private readonly userService:UsersService){}

    @Get()
    async findAll(){
        return await this.subtaskService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        return await this.subtaskService.findOne(id);
    }

    @Post()
    async create(@Body()createSubtaskDto:CreateSubtaskDto,@ActiveUser()user: UserActiveInterface){
        return await this.subtaskService.create(createSubtaskDto,user);
    }

    @Patch(':id')
    async update(@Param('id') id: string,@Body()createSubtaskDto:Partial<CreateSubtaskDto>,@ActiveUser()user:UserActiveInterface){
        return await this.subtaskService.update(id,createSubtaskDto,user);
    }

    @Delete(':id')
    async delete(@Param('id') id:string){
        return await this.subtaskService.deleteSubtaskbyid(id);
    }
    

}
