import { Controller,Body,Post,Patch,Param,Get,Delete } from '@nestjs/common';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { CommentsService } from './comments.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role_User } from '@prisma/client';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';
import { UsersService } from 'src/users/users.service';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';


@Auth(Role_User.USER)
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {

    constructor(
        private readonly commentsService: CommentsService,private readonly userService: UsersService
    ) {}

    @Post()
    create(@Body() createCommentDto: CreateCommentDto, @ActiveUser() user: UserActiveInterface) {
        return this.commentsService.create(createCommentDto, user );
    }

    @Patch('id/:id')
    update(@Param('id') id: string, @Body() updateCommentDto: Partial<CreateCommentDto>, @ActiveUser() user: UserActiveInterface) {
        return this.commentsService.update(id,updateCommentDto, user);
    }

    @Get()
    findAll() {
        return this.commentsService.findAll();
    }
    
    @Get('id/:id')
    findOne(@Param('id') id: string) {
        return this.commentsService.findOne(id);
    }

    @Get('user/comments')
    async getCommentsByUser(@ActiveUser() user: UserActiveInterface) {
        return await this.commentsService.getCommentsByUser(user);
    }

    @Get('tasks/:taskId')
    async findCommentsByTask(@Param('taskId') taskId: string) {
        return this.commentsService.findCommentsByTask(taskId);
    }

    @Get('issues/:issueId')
    async findCommentsByIssue(@Param('issueId') issueId: string) {
        return this.commentsService.findCommentsByIssue(issueId);
    }

    @Delete('id/:id')
    async deleteCommentById(@Param('id') id: string, @ActiveUser() user: UserActiveInterface) {
        return this.commentsService.deleteCommentById(id, user);
    }

}
