import { Controller,Body,Post,Patch,Param,Get } from '@nestjs/common';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { CommentsService } from './comments.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role_User } from '@prisma/client';

@Auth(Role_User.USER)
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    create(@Body() createCommentDto: CreateCommentDto) {
        return this.commentsService.create(createCommentDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommentDto: CreateCommentDto) {
        return this.commentsService.update(id, updateCommentDto);
    }

    @Get()
    findAll() {
        return this.commentsService.findAll();
    }
    
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.commentsService.findOne(id);
    }

}
