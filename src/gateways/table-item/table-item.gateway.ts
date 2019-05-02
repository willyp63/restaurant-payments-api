import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ObjectId } from 'mongodb';

import { TableItemService } from '../../services/table-item/table-item.service';
import { SOCKET_EVENTS } from '../../constants/socket-events.constants';
import { TableItem, TableItemPay } from '../../models';

@WebSocketGateway()
export class TableItemGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(SOCKET_EVENTS.AddTableItem)
  handleAddTableItem(client: any, payload: TableItem) {
    this.tableItemService.add(payload, new ObjectId(payload.tableId)).then(() => {
      // TODO: only emit to clients at table
      this.server.emit(SOCKET_EVENTS.TableItemAdded, {});
    });
  }

  @SubscribeMessage(SOCKET_EVENTS.RemoveTableItem)
  handleRemoveTableItem(client: any, payload: TableItem) {
    this.tableItemService.remove(new ObjectId(payload._id)).then(() => {
      // TODO: only emit to clients at table
      this.server.emit(SOCKET_EVENTS.TableItemRemoved, {});
    });
  }

  @SubscribeMessage(SOCKET_EVENTS.PayForTableItem)
  handlePayForTableItem(client: any, payload: TableItemPay) {
    this.tableItemService.payForItem(new ObjectId(payload.tableItemId), new ObjectId(payload.userId)).then(() => {
      // TODO: only emit to clients at table
      this.server.emit(SOCKET_EVENTS.TableItemPaidFor, {});
    });
  }

  constructor(
    private readonly tableItemService: TableItemService,
  ) {}

}
