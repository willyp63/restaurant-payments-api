import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { TableService } from '../../services/table/table.service';
import { TableItemService } from '../../services/table-item/table-item.service';
import { UserService } from '../../services/user/user.service';
import { Table, TableItem, User } from '../../models';
import { ROUTE_NAMES } from '../../constants/route-names.constants';

@Controller(ROUTE_NAMES.Tables)
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

  @Get(`:id/${ROUTE_NAMES.TableItems}`)
  getAllTableItems(@Param('id') tableId: ObjectId): Promise<TableItem[]> {
    return this.tableItemService.getAllByTableId(tableId);
  }

  @Get(`:id/${ROUTE_NAMES.Users}`)
  getAllUsersAtTable(@Param('id') tableId: ObjectId): Promise<User[]> {
    return this.userService.getAllUsersAtTable(tableId);
  }

  constructor(
    private readonly tableService: TableService,
    private readonly tableItemService: TableItemService,
    private readonly userService: UserService,
  ) {}
  
}
