import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MemberGuard } from 'src/auth/Guards/member.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AdminGuard } from 'src/auth/Guards/admin.guard';

@Controller('groups/:groupId/expenses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @UseGuards(MemberGuard)
  create(@Param('groupId') groupId: string, @CurrentUser() user: any, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(groupId, user.id, createExpenseDto);
  }

  @Get()
  findAll(@Param('groupId') groupId: string) {
    return this.expenseService.findAll(groupId);
  }

  @Get(':id')
  @UseGuards(MemberGuard)
  findOne(@Param('groupId') groupId: string, @Param('id') id: string) {
    return this.expenseService.findOne(groupId, id);
  }

  @Patch(':id')
  @UseGuards(MemberGuard)
    update(@Param('groupId') groupId: string, @Param('id') id: string, @CurrentUser() user: any, @Body() updateExpenseDto: UpdateExpenseDto) {
      return this.expenseService.update(groupId, id, updateExpenseDto, user.id);
  }

  @Delete(':id')
  @UseGuards(MemberGuard)
  remove(@Param('groupId') groupId: string, @Param('id') id: string, @CurrentUser() user: any) {
    return this.expenseService.remove(groupId, id, user.id);
  }
}
