import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewGroupCreatedDto } from './dto/group-created.dto';
import { BadRequestGroupCreateDto } from './dto/bad-request-group-create.dto';
import { AdminGuard } from 'src/auth/Guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { MemberGuard } from 'src/auth/Guards/member.guard';
import { PaginationGroupDto } from './dto/pagination-group.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Groups')
@ApiBearerAuth('access-token')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo grupo' })
  @ApiResponse({ status: 201, description: 'El grupo ha sido creado exitosamente.', type: NewGroupCreatedDto })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta', type: BadRequestGroupCreateDto })
  @ApiCreatedResponse({
    description: 'El grupo ha sido creado exitosamente.',
    type: NewGroupCreatedDto,
  })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta', type: BadRequestGroupCreateDto })
  create(@Body() createGroupDto: CreateGroupDto, @CurrentUser() user: { id: string }) {
    return this.groupService.create(createGroupDto, user.id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de grupos obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Obtiene todos los grupos' })
  @UseGuards(JwtAuthGuard, MemberGuard)
  findAll(@Query() pagination: PaginationGroupDto) {
    const { page = 1, limit = 10 } = pagination;
    return this.groupService.findAll(page, limit);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Grupo obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiOperation({ summary: 'Obtiene un grupo por ID' })
  @UseGuards(JwtAuthGuard, MemberGuard)
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Grupo actualizado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiOperation({ summary: 'Actualiza un grupo por ID' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Grupo eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiOperation({ summary: 'Elimina un grupo por ID' })
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
