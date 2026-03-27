import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { MemberGuard } from 'src/auth/Guards/member.guard';

@Controller('groups/:groupId/settlements')
@ApiBearerAuth('access-token')
@ApiParam({ name: 'groupId', required: true, description: 'Group UUID' })
@UseGuards(JwtAuthGuard, MemberGuard)
@ApiTags('Settlements')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}


  @Post()
  @ApiResponse({ status: 201, description: 'El asento ha sido creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiOperation({ summary: 'Crea un nuevo asiento de liquidación en un grupo' })
  create(
    @Param('groupId') groupId: string,
    @Body() createSettlementDto: CreateSettlementDto,
    @Req() req,
  ) {
    return this.settlementService.create(groupId, createSettlementDto, req.user.id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de asientos de liquidación obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiOperation({ summary: 'Obtiene todos los asientos de liquidación de un grupo' })
  findByGroup(@Param('groupId') groupId: string) {
    return this.settlementService.findByGroup(groupId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Asiento de liquidación obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Asiento de liquidación no encontrado' })
  @ApiOperation({ summary: 'Obtiene un asiento de liquidación por ID' })
  findOne(@Param('id') id: string) {
    return this.settlementService.findOne(id);
  }
}

