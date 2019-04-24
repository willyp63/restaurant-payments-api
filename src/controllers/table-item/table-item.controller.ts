import { Controller, Patch, Param, Body, Delete } from '@nestjs/common';
import { TableItem } from '../../models/table-item.model';
import { TableItemService } from '../../services/table-item/table-item.service';

@Controller('table-item')
export class TableItemController {
  constructor(
    private readonly tableItemService: TableItemService,
  ) {}

  @Patch(':id')
  updateTableWithId(@Param('id') itemId: string, @Body() item: TableItem): Promise<TableItem> {
    return this.tableItemService.updateTableItemWithId(itemId, item);
  }

  @Delete(':id')
  removeTable(@Param('id') itemId: string): Promise<void> {
    return this.tableItemService.removeTableItem(itemId);
  }
}
