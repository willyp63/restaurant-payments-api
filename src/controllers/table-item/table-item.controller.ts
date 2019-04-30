import { Controller, Patch, Param, Body, Delete, Post } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { TableItemService } from '../../services/table-item/table-item.service';
import { TableItemPayService } from '../../services/table-item-pay/table-item-pay.service';
import { TableItem, User, TableItemPay } from '../../models';

@Controller('table-item')
export class TableItemController {
  
  @Patch(':id')
  updateTableItem(@Param('id') itemId: ObjectId, @Body() item: Partial<TableItem>): Promise<void> {
    return this.tableItemService.update(itemId, item);
  }

  @Delete(':id')
  removeTableItem(@Param('id') itemId: ObjectId): Promise<void> {
    return this.tableItemService.remove(itemId);
  }

  /* --- Payments ---*/
  @Post(':id/pay')
  payForTableItem(@Param('id') itemId: ObjectId, @Body() user: Partial<User>): Promise<TableItemPay> {
    return this.tableItemPayService.payForItem(itemId, new ObjectId(user._id));
  }

  constructor(
    private readonly tableItemService: TableItemService,
    private readonly tableItemPayService: TableItemPayService,
  ) {}
}
