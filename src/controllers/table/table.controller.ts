import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { TableService } from '../../services/table/table.service';
import { TableItemService } from '../../services/table-item/table-item.service';
import { TableJoinService } from '../../services/table-join/table-join.service';
import { Table, TableItem, User, TableJoin } from '../../models';

@Controller('table')
export class TableController {
  constructor(
    private readonly tableService: TableService,
    private readonly tableItemService: TableItemService,
    private readonly tableJoinService: TableJoinService,
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

  @Post(':id/add-user')
  addUserToTable(@Param('id') tableId: ObjectId, @Body() user: Partial<User>): Promise<TableJoin> {
    return this.tableJoinService.addUserToTable(new ObjectId(user._id), tableId);
  }

  @Get(':id/users')
  getAllUsersAtTable(@Param('id') tableId: ObjectId): Promise<TableJoin[]> {
    return this.tableJoinService.getAllUsersAtTable(tableId);
  }

  @Delete(':id')
  removeTable(@Param('id') tableId: ObjectId): Promise<void> {
    return this.tableService.remove(tableId);
  }
}
