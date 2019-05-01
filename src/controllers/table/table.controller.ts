import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { TableService } from '../../services/table/table.service';
import { TableItemService } from '../../services/table-item/table-item.service';
import { TableJoinService } from '../../services/table-join/table-join.service';
import { Table, TableItem, User, TableJoin } from '../../models';

@Controller('table')
export class TableController {

  @Get()
  getAllTables(): Promise<Table[]> {
    return this.tableService.getAll();
  }

  @Get(':id')
  getTable(@Param('id') tableId: ObjectId): Promise<Table> {
    return this.tableService.get(tableId);
  }

  @Post()
  addTable(@Body() table: Table): Promise<Table> {
    return this.tableService.add(table);
  }

  @Patch(':id')
  updateTable(@Param('id') tableId: ObjectId, @Body() table: Partial<Table>): Promise<void> {
    return this.tableService.update(tableId, table);
  }

  @Delete(':id')
  removeTable(@Param('id') tableId: ObjectId): Promise<void> {
    return this.tableService.remove(tableId);
  }

  /* --- Table Items --- */
  @Post(':id/items')
  addItemToTable(@Param('id') tableId: ObjectId, @Body() item: TableItem): Promise<TableItem> {
    return this.tableItemService.add(item, tableId);
  }

  @Get(':id/items')
  getAllTableItems(@Param('id') tableId: ObjectId): Promise<TableItem[]> {
    return this.tableItemService.getAllByTableId(tableId);
  }

  /* --- Table Users --- */
  @Post(':id/users')
  addUserToTable(@Param('id') tableId: ObjectId, @Body() user: Partial<User>): Promise<TableJoin> {
    return this.tableJoinService.addUserToTable(new ObjectId(user._id), tableId);
  }

  @Get(':id/users')
  getAllUsersAtTable(@Param('id') tableId: ObjectId): Promise<User[]> {
    return this.tableJoinService.getAllUsersAtTable(tableId);
  }

  @Get(':id/users-that-left')
  getAllUsersThatLeftTable(@Param('id') tableId: ObjectId): Promise<User[]> {
    return this.tableJoinService.getAllUsersThatLeftTable(tableId);
  }

  constructor(
    private readonly tableService: TableService,
    private readonly tableItemService: TableItemService,
    private readonly tableJoinService: TableJoinService,
  ) {}
}
