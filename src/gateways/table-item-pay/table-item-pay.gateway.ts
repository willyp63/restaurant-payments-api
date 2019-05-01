import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

import { TableItemPayService } from '../../services/table-item-pay/table-item-pay.service';
import { TableItemPay } from '../../models';
import { PAY_FOR_TABLE_ITEM, TABLE_ITEM_PAID_FOR } from 'constants/socket-messages.constants';

@WebSocketGateway()
export class TableItemPayGateway {
  constructor(
    private readonly tableItemPayService: TableItemPayService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(PAY_FOR_TABLE_ITEM)
  handleJoinTable(client: any, payload: TableItemPay) {
    const tableId = payload.tableId as string;
    const tableItemId = payload.tableItemId as string;
    const userId = payload.userId as string;

    this.tableItemPayService.payForItem(new ObjectId(tableItemId), new ObjectId(userId)).then(() => {
      // TODO: only emit to client at table
      this.server.emit(TABLE_ITEM_PAID_FOR, {});
    });
  }
}
