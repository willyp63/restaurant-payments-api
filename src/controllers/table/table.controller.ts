import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TableService } from 'services/table/table.service';
import { Table } from 'models/table.model';
import { TableItem } from 'models/table-item.model';

@Controller('table')
export class TableController {
  constructor(
    private readonly _tableService: TableService,
  ) {}

  @Get('all')
  getTable(): Promise<Table[]> {
    return this._tableService.getTables();
  }

  @Get(':id')
  getTableById(@Param('id') tableId: string): Promise<Table> {
    return this._tableService.getTableById(tableId);
  }

  @Post('new')
  addTable(@Body() table: Table): Promise<void> {
    return this._tableService.addTable(table);
  }

  @Post(':id/add-item')
  addItemToTable(@Param('id') tableId: string, @Body() item: TableItem): Promise<void> {
    return this._tableService.addItemToTable(tableId, item);
  }
}
