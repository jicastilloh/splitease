import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExpenseSplitService } from './expense-split.service';
import { CreateExpenseSplitDto } from './dto/create-expense-split.dto';
import { UpdateExpenseSplitDto } from './dto/update-expense-split.dto';
import { AdminGuard } from 'src/auth/Guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('expense-split')
@ApiBearerAuth('access-token')
export class ExpenseSplitController {
  constructor(private readonly expenseSplitService: ExpenseSplitService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createExpenseSplitDto: CreateExpenseSplitDto) {
    return this.expenseSplitService.create(createExpenseSplitDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() {
    return this.expenseSplitService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findOne(@Param('id') id: string) {
    return this.expenseSplitService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateExpenseSplitDto: UpdateExpenseSplitDto) {
    return this.expenseSplitService.update(+id, updateExpenseSplitDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.expenseSplitService.remove(+id);
  }
}
