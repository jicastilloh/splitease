import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { MemberGuard } from 'src/auth/Guards/member.guard';

@Controller('groups/:groupId/balances')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, MemberGuard)
@ApiTags('Balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de balances obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiOperation({ summary: 'Obtiene los balances de un grupo' })
  getGroupBalances(@Param('groupId') groupId: string) {
    return this.balancesService.getGroupBalances(groupId);
  }

  @Get('me')
  @ApiResponse({ status: 200, description: 'Balance obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiOperation({ summary: 'Obtiene el balance del usuario actual en un grupo' })
  getMyBalance(@Param('groupId') groupId: string, @Req() req) {
    return this.balancesService.getMyBalance(groupId, req.user.id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'El balance ha sido creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiOperation({ summary: 'Crea un nuevo balance en un grupo' })
  create(@Body() createBalanceDto: CreateBalanceDto) {
    return this.balancesService.create(createBalanceDto);
  }


  @Get(':id')
  @ApiResponse({ status: 200, description: 'Balance obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Balance no encontrado' })
  @ApiOperation({ summary: 'Obtiene un balance por ID' })
  findOne(@Param('id') id: string) {
    return this.balancesService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Balance actualizado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Balance no encontrado' })
  @ApiOperation({ summary: 'Actualiza un balance por ID' })
  update(@Param('id') id: string, @Body() updateBalanceDto: UpdateBalanceDto) {
    return this.balancesService.update(+id, updateBalanceDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Balance eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Balance no encontrado' })
  @ApiOperation({ summary: 'Elimina un balance por ID' })
  remove(@Param('id') id: string) {
    return this.balancesService.remove(+id);
  }
}
