import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

import { TableJoin } from '../../models';
import { TableJoinService } from '../../services/table-join/table-join.service';

@WebSocketGateway()
export class TableJoinGateway {
  constructor(
    private readonly tableJoinService: TableJoinService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('add_user_to_table')
  handleAddUserToTable(client: any, payload: TableJoin) {
    this.tableJoinService.addUserToTable(new ObjectId(payload.userId), new ObjectId(payload.tableId)).then(tableJoin => {
      this.server.emit('user_joined_table', tableJoin);
    });
  }
}
