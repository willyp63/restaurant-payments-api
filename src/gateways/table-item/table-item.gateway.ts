import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ObjectId } from 'mongodb';

import { TableItemService } from '../../services/table-item/table-item.service';
import { ADD_TABLE_ITEM, TABLE_ITEM_ADDED, REMOVE_TABLE_ITEM, TABLE_ITEM_REMOVED } from '../../constants/socket-messages.constants';
import { TableItem } from '../../models';

@WebSocketGateway()
export class TableItemGateway {
  constructor(
    private readonly tableItemService: TableItemService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(ADD_TABLE_ITEM)
  handleAddTableItem(client: any, payload: TableItem) {
    this.tableItemService.add(payload, new ObjectId(payload.tableId)).then(() => {
      // TODO: only emit to client at table
      this.server.emit(TABLE_ITEM_ADDED, {});
    });
  }

  @SubscribeMessage(REMOVE_TABLE_ITEM)
  handleRemoveTableItem(client: any, payload: TableItem) {
    this.tableItemService.remove(new ObjectId(payload._id)).then(() => {
      // TODO: only emit to client at table
      this.server.emit(TABLE_ITEM_REMOVED, {});
    });
  }
}
