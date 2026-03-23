import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { NewGroupMemberCreatedDto } from './dto/grup-member-created.dto';
import { BadRequestGroupMemberCreateDto } from './dto/bad-request-group-member.dto';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { AddMemberDto } from './dto/add-member.dto';
import { AdminGuard } from 'src/auth/Guards/admin.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { MemberGuard } from 'src/auth/Guards/member.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('group/:groupId/members')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiCreatedResponse({
    description: 'The member has been successfully added to the group.',
    type: NewGroupMemberCreatedDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request', type: BadRequestGroupMemberCreateDto })
  addMember(
    @Param('groupId') groupId: string,
    @Body() dto: AddMemberDto,
    @CurrentUser() user: any,
  ) {
    return this.groupMemberService.addMemberToGroup({ ...dto, groupId }, user.id);
  }

  @Get()
  @UseGuards(MemberGuard)
  findAll(@Param('groupId') groupId: string) {
    return this.groupMemberService.findAll(groupId);
  }

  @Get(':id')
  @UseGuards(MemberGuard)
  findOne(@Param('groupId') groupId: string, @Param('id') id: string) {
    return this.groupMemberService.findOne(groupId, id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
    @Body() updateGroupMemberDto: UpdateGroupMemberDto,
    @CurrentUser() user: any,
  ) {
    return this.groupMemberService.update(groupId, id, user.id, updateGroupMemberDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('groupId') groupId: string, @Param('id') id: string, @CurrentUser() user: any) {
    return this.groupMemberService.remove(groupId, id, user.id);
  }
}
