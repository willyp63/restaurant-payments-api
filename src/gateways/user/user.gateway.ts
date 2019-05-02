import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

import { TableJoin } from '../../models';
import { SOCKET_MESSAGES } from '../../constants/socket-messages.constants';
import { UserService } from '../../services/user/user.service';

@WebSocketGateway()
export class UserGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(SOCKET_MESSAGES.JoinTable)
  handleJoinTable(client: any, payload: TableJoin) {
    const tableId = payload.tableId as string;
    const userId = payload.userId as string;

    this.userService.addUserToTable(new ObjectId(userId), new ObjectId(tableId)).then(() => {
      // TODO: only emit to client at table
      this.server.emit(SOCKET_MESSAGES.UserJoinedTable, {});
    });
  }

  @SubscribeMessage(SOCKET_MESSAGES.LeaveTable)
  handleLeaveTable(client: any, payload: TableJoin) {
    const tableId = payload.tableId as string;
    const userId = payload.userId as string;

    this.userService.removeUserFromTable(new ObjectId(userId), new ObjectId(tableId)).then(() => {
      // TODO: only emit to client at table
      this.server.emit(SOCKET_MESSAGES.UserLeftTable, {});
    });
  }

  constructor(
    private readonly userService: UserService,
  ) {}
  
}
