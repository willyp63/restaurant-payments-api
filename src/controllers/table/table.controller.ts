import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TableService } from '../../services/table/table.service';
import { Table } from '../../models/table.model';
import { TableItem } from '../../models/table-item.model';
import { ObjectId } from 'mongodb';

@Controller('table')
export class TableController {
  constructor(
    private readonly tableService: TableService,
  ) {}

  @Get('/')
  getTable(): Promise<Table[]> {
    return this.tableService.getTables();
  }

  @Get(':id')
  getTableById(@Param('id') tableId: ObjectId): Promise<Table> {
    return this.tableService.getTableById(tableId);
  }

  @Patch(':id')
  updateTableWithId(@Param('id') tableId: ObjectId, @Body() table: Partial<Table>): Promise<void> {
    return this.tableService.updateTableWithId(tableId, table);
  }

  @Post('/')
  addTable(@Body() table: Table): Promise<Table> {
    return this.tableService.addTable(table);
  }

  @Post(':id/add-item')
  addItemToTable(@Param('id') tableId: ObjectId, @Body() item: TableItem): Promise<TableItem> {
    return this.tableService.addItemToTable(tableId, item);
  }

  @Delete(':id')
  removeTable(@Param('id') tableId: ObjectId): Promise<void> {
    return this.tableService.removeTable(tableId);
  }
}
