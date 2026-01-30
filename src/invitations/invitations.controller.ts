import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role_User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { ActiveUser } from 'src/users/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/auth/interface/user-active.interface';

@Auth(Role_User.USER)
@ApiTags('Workspace')
@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly user: UsersService,
  ) {}
  @Post('create')
  create(@Body() createInvitationDto: CreateInvitationDto, @ActiveUser() user: UserActiveInterface) {
    return this.invitationsService.createInvitation(createInvitationDto, user);
  }

  @Post('join/:code')
  join(
    @Param('code') code: string,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.invitationsService.acceptInvitation(code, user);
  }

  @Get()
  findAll() {
    return this.invitationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvitationDto: UpdateInvitationDto) {
    return this.invitationsService.update(+id, updateInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: UserActiveInterface) {
    return this.invitationsService.remove(id, user);
  }
}
