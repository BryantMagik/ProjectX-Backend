import { Controller,Post,Body, Get, Param,Patch,Delete } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssue } from './dto/CreateIssue.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role_User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';

@Auth(Role_User.USER)
@ApiTags('Issues')
@Controller('issues')
export class IssuesController {
    constructor(private issueService: IssuesService, private readonly userService: UsersService){}

    @Get()
    findAll() {
        return this.issueService.findAll();
    };

    @Get(':id')
    findOne(@Param('id') id:string){
        return this.issueService.findOne(id);
    }

    @Post()
    create(@Body() createIssueDto: CreateIssue,@ActiveUser()user: UserActiveInterface){
        return this.issueService.createIssue(createIssueDto,user);
    }

    @Patch(':id')
    updateIssue(@Param('id') id:string,@Body() updateIssueDto: Partial<CreateIssue> ,@ActiveUser() user:UserActiveInterface){
        return this.issueService.updateIssue(id,updateIssueDto,user);
    }

    @Delete(':id')
    async deleteIssueById(@Param('id') id:string,@ActiveUser() user:UserActiveInterface){
        return this.issueService.deleteIssueById(id, user);
    }
}
