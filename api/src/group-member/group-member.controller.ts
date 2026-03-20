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

@Controller('group-member')
@ApiBearerAuth('access-token')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The member has been successfully added to the group.',
    type: NewGroupMemberCreatedDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request', type: BadRequestGroupMemberCreateDto })
  create(@Body() createGroupMemberDto: CreateGroupMemberDto) {
    return this.groupMemberService.create(createGroupMemberDto);
  }

  @Post(':groupId/members')
  @UseGuards(JwtAuthGuard, AdminGuard)
  addMember(
    @Param('groupId') groupId: string,
    @Body() dto: AddMemberDto,
    @CurrentUser() user: any,
  ) {
  return this.groupMemberService.addMemberToGroup(
    { ...dto, groupId },
    user.id,
  );
  }

  @Get()
  findAll() {
    return this.groupMemberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupMemberService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupMemberDto: UpdateGroupMemberDto) {
    return this.groupMemberService.update(id, updateGroupMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupMemberService.remove(id);
  }
}
