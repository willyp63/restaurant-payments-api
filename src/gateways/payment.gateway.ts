import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TableItemPay } from '../models/table-item-pay.model';
import { TableItemService } from '../services/table-item/table-item.service';
import { ObjectId } from 'mongodb';

@WebSocketGateway()
export class PaymentGateway {
  constructor(
    private readonly tableItemService: TableItemService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('pay_for_item')
  handleMessage(client: any, itemPay: TableItemPay) {
    console.log('MESSAGE RECIVED');

    this.tableItemService.payForTableItem(new ObjectId(itemPay.tableItemId)).then(() => {
      this.server.emit('item_paid_for', itemPay);
    });
  }
}
