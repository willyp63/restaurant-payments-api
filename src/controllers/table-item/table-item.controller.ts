import { Controller, Patch, Param, Body, Delete, Post } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { TableItemService } from '../../services/table-item/table-item.service';
import { TableItemPayService } from '../../services/table-item-pay/table-item-pay.service';
import { TableItem, User, TableItemPay } from '../../models';

@Controller('table-item')
export class TableItemController {
  constructor(
    private readonly tableItemService: TableItemService,
    private readonly tableItemPayService: TableItemPayService,
  ) {}

  @Patch(':id')
  updateTableWithId(@Param('id') itemId: ObjectId, @Body() item: Partial<TableItem>): Promise<void> {
    return this.tableItemService.update(itemId, item);
  }

  @Delete(':id')
  removeTableItem(@Param('id') itemId: ObjectId): Promise<void> {
    return this.tableItemService.remove(itemId);
  }

  @Post(':id/pay')
  payForTableItem(@Param('id') itemId: ObjectId, @Body() user: Partial<User>): Promise<TableItemPay> {
    return this.tableItemPayService.add({ tableItemId: itemId, userId: new ObjectId(user._id) });
  }
}
