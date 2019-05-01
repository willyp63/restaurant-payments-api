import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

import { TableJoin } from '../../models';
import { TableJoinService } from '../../services/table-join/table-join.service';
import { JOIN_TABLE, LEAVE_TABLE, USER_JOINED_TABLE, USER_LEFT_TABLE } from 'constants/socket-messages.constants';

@WebSocketGateway()
export class TableJoinGateway {
  constructor(
    private readonly tableJoinService: TableJoinService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(JOIN_TABLE)
  handleJoinTable(client: any, payload: TableJoin) {
    const tableId = payload.tableId as string;
    const userId = payload.userId as string;

    this.tableJoinService.addUserToTable(new ObjectId(userId), new ObjectId(tableId)).then(() => {
      // TODO: only emit to client at table
      this.server.emit(USER_JOINED_TABLE, {});
    });
  }

  @SubscribeMessage(LEAVE_TABLE)
  handleLeaveTable(client: any, payload: TableJoin) {
    const tableId = payload.tableId as string;
    const userId = payload.userId as string;

    this.tableJoinService.removeUserFromTable(new ObjectId(userId), new ObjectId(tableId)).then(() => {
      // TODO: only emit to client at table
      this.server.emit(USER_LEFT_TABLE, {});
    });
  }
}
