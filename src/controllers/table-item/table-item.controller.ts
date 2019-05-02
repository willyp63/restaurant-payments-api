import { Controller, Patch, Param, Body } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { TableItemService } from '../../services/table-item/table-item.service';
import { TableItem } from '../../models';

@Controller('table-item')
export class TableItemController {
  
  // TODO: move to gateway, so updates are broadcast to all users
  @Patch(':id')
  updateTableItem(@Param('id') itemId: ObjectId, @Body() item: Partial<TableItem>): Promise<void> {
    return this.tableItemService.update(itemId, item);
  }

  constructor(
    private readonly tableItemService: TableItemService,
  ) {}
}
