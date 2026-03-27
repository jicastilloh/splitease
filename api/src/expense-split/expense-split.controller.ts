import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExpenseSplitService } from './expense-split.service';
import { CreateExpenseSplitDto } from './dto/create-expense-split.dto';
import { UpdateExpenseSplitDto } from './dto/update-expense-split.dto';
import { AdminGuard } from 'src/auth/Guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('expense-split')
@ApiBearerAuth('access-token')
@ApiTags('Expense Splits')
@UseGuards(JwtAuthGuard)
export class ExpenseSplitController {
  constructor(private readonly expenseSplitService: ExpenseSplitService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'La división de gasto ha sido creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiOperation({ summary: 'Crea una nueva división de gasto' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createExpenseSplitDto: CreateExpenseSplitDto) {
    return this.expenseSplitService.create(createExpenseSplitDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de divisiones de gasto obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Obtiene todas las divisiones de gasto' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() {
    return this.expenseSplitService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'División de gasto obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'División de gasto no encontrada' })
  @ApiOperation({ summary: 'Obtiene una división de gasto por ID' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  findOne(@Param('id') id: string) {
    return this.expenseSplitService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'División de gasto actualizada exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'División de gasto no encontrada' })
  @ApiOperation({ summary: 'Actualiza una división de gasto por ID' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateExpenseSplitDto: UpdateExpenseSplitDto) {
    return this.expenseSplitService.update(+id, updateExpenseSplitDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'División de gasto eliminada exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'División de gasto no encontrada' })
  @ApiOperation({ summary: 'Elimina una división de gasto por ID' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.expenseSplitService.remove(+id);
  }
}
