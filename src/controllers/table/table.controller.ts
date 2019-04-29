import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { TableService } from '../../services/table/table.service';
import { TableItemService } from '../../services/table-item/table-item.service';
import { Table, TableItem } from '../../models';

@Controller('table')
export class TableController {
  constructor(
    private readonly tableService: TableService,
    private readonly tableItemService: TableItemService,
  ) {}

  @Get('/')
  getTable(): Promise<Table[]> {
    return this.tableService.getAll();
  }

  @Get(':id')
  getTableById(@Param('id') tableId: ObjectId): Promise<Table> {
    return this.tableService.get(tableId);
  }

  @Patch(':id')
  updateTableWithId(@Param('id') tableId: ObjectId, @Body() table: Partial<Table>): Promise<void> {
    return this.tableService.update(tableId, table);
  }

  @Post('/')
  addTable(@Body() table: Table): Promise<Table> {
    return this.tableService.add(table);
  }

  @Post(':id/add-item')
  addItemToTable(@Param('id') tableId: ObjectId, @Body() item: TableItem): Promise<TableItem> {
    return this.tableItemService.add(item, tableId);
  }

  @Delete(':id')
  removeTable(@Param('id') tableId: ObjectId): Promise<void> {
    return this.tableService.remove(tableId);
  }
}
