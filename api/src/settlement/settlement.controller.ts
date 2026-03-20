import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('settlement')
@ApiBearerAuth('access-token')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Post()
  create(@Body() createSettlementDto: CreateSettlementDto) {
    return this.settlementService.create(createSettlementDto);
  }

  @Get()
  findAll() {
    return this.settlementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settlementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettlementDto: UpdateSettlementDto) {
    return this.settlementService.update(+id, updateSettlementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settlementService.remove(+id);
  }
}
