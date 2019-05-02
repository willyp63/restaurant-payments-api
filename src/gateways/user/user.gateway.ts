import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

import { TableJoin } from '../../models';
import { SOCKET_EVENTS } from '../../constants/socket-events.constants';
import { UserService } from '../../services/user/user.service';

@WebSocketGateway()
export class UserGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(SOCKET_EVENTS.JoinTable)
  handleJoinTable(client: any, payload: TableJoin) {
    const tableId = payload.tableId as string;
    const userId = payload.userId as string;

    this.userService.addUserToTable(new ObjectId(userId), new ObjectId(tableId)).then(() => {
      // TODO: only emit to client at table
      this.server.emit(SOCKET_EVENTS.UserJoinedTable, {});
    });
  }

  @SubscribeMessage(SOCKET_EVENTS.LeaveTable)
  handleLeaveTable(client: any, payload: TableJoin) {
    const tableId = payload.tableId as string;
    const userId = payload.userId as string;

    this.userService.removeUserFromTable(new ObjectId(userId), new ObjectId(tableId)).then(() => {
      // TODO: only emit to client at table
      this.server.emit(SOCKET_EVENTS.UserLeftTable, {});
    });
  }

  constructor(
    private readonly userService: UserService,
  ) {}
  
}
