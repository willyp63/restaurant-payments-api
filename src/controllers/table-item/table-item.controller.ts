import { Controller, Patch, Param, Body, Delete } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { TableItemService } from '../../services/table-item/table-item.service';
import { TableItem } from '../../models';

@Controller('table-item')
export class TableItemController {
  constructor(
    private readonly tableItemService: TableItemService,
  ) {}

  @Patch(':id')
  updateTableWithId(@Param('id') itemId: ObjectId, @Body() item: Partial<TableItem>): Promise<void> {
    return this.tableItemService.update(itemId, item);
  }

  @Delete(':id')
  removeTableItem(@Param('id') itemId: ObjectId): Promise<void> {
    return this.tableItemService.remove(itemId);
  }
}
