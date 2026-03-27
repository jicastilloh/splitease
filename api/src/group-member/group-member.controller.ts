import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewGroupMemberCreatedDto } from './dto/grup-member-created.dto';
import { BadRequestGroupMemberCreateDto } from './dto/bad-request-group-member.dto';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { AddMemberDto } from './dto/add-member.dto';
import { AdminGuard } from 'src/auth/Guards/admin.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { MemberGuard } from 'src/auth/Guards/member.guard';

@Controller('groups/:groupId/members')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@ApiTags('Group Members')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Post('/')
  @ApiResponse({ status: 201, description: 'El miembro ha sido agregado al grupo exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiOperation({ summary: 'Agrega un nuevo miembro al grupo' })
  @UseGuards(AdminGuard)
  @ApiCreatedResponse({
    description: 'El miembro ha sido agregado al grupo exitosamente.',
    type: NewGroupMemberCreatedDto,
  })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta', type: BadRequestGroupMemberCreateDto })
  addMember(
    @Param('groupId') groupId: string,
    @Body() dto: AddMemberDto,
    @CurrentUser() user: any,
  ) {
    return this.groupMemberService.addMemberToGroup({ ...dto, groupId }, user.id);
  }

  @Get('/')
  @UseGuards(MemberGuard)
  @ApiResponse({ status: 200, description: 'Lista de miembros del grupo obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiOperation({ summary: 'Obtiene todos los miembros de un grupo' })
  async findAll(@Param('groupId') groupId: string) {
    const all = await this.groupMemberService.findAll();
    return all.filter((m: any) => m.groupId === groupId);
  }

  @Get(':id')
  @UseGuards(MemberGuard)
  @ApiResponse({ status: 200, description: 'Miembro del grupo obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Miembro del grupo no encontrado' })
  @ApiOperation({ summary: 'Obtiene un miembro del grupo por ID' })
  findOne(@Param('id') id: string) {
    return this.groupMemberService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiResponse({ status: 200, description: 'Miembro del grupo actualizado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Miembro del grupo no encontrado' })
  @ApiOperation({ summary: 'Actualiza un miembro del grupo por ID' })
  update(@Param('id') id: string, @Body() updateGroupMemberDto: UpdateGroupMemberDto) {
    return this.groupMemberService.update(id, updateGroupMemberDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiResponse({ status: 200, description: 'Miembro del grupo eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Miembro del grupo no encontrado' })
  @ApiOperation({ summary: 'Elimina un miembro del grupo por ID' })
  remove(@Param('id') id: string) {
    return this.groupMemberService.remove(id);
  }
}
