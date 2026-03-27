import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberGuard } from 'src/auth/Guards/member.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AdminGuard } from 'src/auth/Guards/admin.guard';

@Controller('groups/:groupId/expenses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@ApiTags('Expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'El gasto ha sido creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiOperation({ summary: 'Crea un nuevo gasto en un grupo' })
  @UseGuards(MemberGuard)
  create(@Param('groupId') groupId: string, @CurrentUser() user: any, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(groupId, user.id, createExpenseDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de gastos obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiOperation({ summary: 'Obtiene todos los gastos de un grupo' })
  findAll(@Param('groupId') groupId: string) {
    return this.expenseService.findAll(groupId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Gasto obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  @ApiOperation({ summary: 'Obtiene un gasto por ID' })
  @UseGuards(MemberGuard)
  findOne(@Param('groupId') groupId: string, @Param('id') id: string) {
    return this.expenseService.findOne(groupId, id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Gasto actualizado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  @ApiOperation({ summary: 'Actualiza un gasto por ID' })
  @UseGuards(MemberGuard)
    update(@Param('groupId') groupId: string, @Param('id') id: string, @CurrentUser() user: any, @Body() updateExpenseDto: UpdateExpenseDto) {
      return this.expenseService.update(groupId, id, updateExpenseDto, user.id);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Gasto eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  @ApiOperation({ summary: 'Elimina un gasto por ID' })
  @UseGuards(MemberGuard)
  remove(@Param('groupId') groupId: string, @Param('id') id: string, @CurrentUser() user: any) {
    return this.expenseService.remove(groupId, id, user.id);
  }
}
