import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

import { TableItemPayService } from '../../services/table-item-pay/table-item-pay.service';
import { TableItemPay } from '../../models';

@WebSocketGateway()
export class TableItemPayGateway {
  constructor(
    private readonly tableItemPayService: TableItemPayService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('pay_for_table_item')
  handlePayForTableItem(client: any, payload: TableItemPay) {
    this.tableItemPayService.payForItem(new ObjectId(payload.tableItemId), new ObjectId(payload.userId)).then(tableJoin => {
      this.server.emit('table_item_paid_for', tableJoin);
    });
  }
}
