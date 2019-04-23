import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TableService } from 'services/table/table.service';
import { Table } from 'models/table.model';
import { TableItem } from 'models/table-item.model';

@Controller('table')
export class TableController {
  constructor(
    private readonly tableService: TableService,
  ) {}

  @Get('all')
  getTable(): Promise<Table[]> {
    return this.tableService.getTables();
  }

  @Get(':id')
  getTableById(@Param('id') tableId: string): Promise<Table> {
    return this.tableService.getTableById(tableId);
  }

  @Patch(':id')
  updateTableWithId(@Param('id') tableId: string, @Body() table: Table): Promise<Table> {
    return this.tableService.updateTableWithId(tableId, table);
  }

  @Post('new')
  addTable(@Body() table: Table): Promise<Table> {
    return this.tableService.addTable(table);
  }

  @Post(':id/add-item')
  addItemToTable(@Param('id') tableId: string, @Body() item: TableItem): Promise<TableItem> {
    return this.tableService.addItemToTable(tableId, item);
  }

  @Delete(':id')
  removeTable(@Param('id') tableId: string): Promise<void> {
    return this.tableService.removeTable(tableId);
  }
}
