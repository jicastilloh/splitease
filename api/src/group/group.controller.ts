import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { NewGroupCreatedDto } from './dto/group-created.dto';
import { BadRequestGroupCreateDto } from './dto/bad-request-group-create.dto';
import { AdminGuard } from 'src/auth/Guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { MemberGuard } from 'src/auth/Guards/member.guard';
import { PaginationGroupDto } from './dto/pagination-group.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The group has been successfully created.',
    type: NewGroupCreatedDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request', type: BadRequestGroupCreateDto })
  create(
    @Body() createGroupDto: CreateGroupDto,
    @CurrentUser() user: {id: string}) {
    return this.groupService.create(createGroupDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, MemberGuard)
  findAll(@Query() pagination: PaginationGroupDto) {
    const { page = 1, limit = 10 } = pagination;
    return this.groupService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, MemberGuard)
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
