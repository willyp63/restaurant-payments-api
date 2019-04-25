import { Controller, Patch, Param, Body, Delete } from '@nestjs/common';
import { TableItem } from '../../models/table-item.model';
import { TableItemService } from '../../services/table-item/table-item.service';
import { ObjectId } from 'mongodb';

@Controller('table-item')
export class TableItemController {
  constructor(
    private readonly tableItemService: TableItemService,
  ) {}

  @Patch(':id')
  updateTableWithId(@Param('id') itemId: ObjectId, @Body() item: Partial<TableItem>): Promise<void> {
    return this.tableItemService.updateTableItemWithId(itemId, item);
  }

  @Delete(':id')
  removeTableItem(@Param('id') itemId: ObjectId): Promise<void> {
    return this.tableItemService.removeTableItem(itemId);
  }
}
