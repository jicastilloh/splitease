import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseSplitDto } from './create-expense-split.dto';

export class UpdateExpenseSplitDto extends PartialType(CreateExpenseSplitDto) {}
