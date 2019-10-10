import { Module } from '@nestjs/common';

import { TableController } from './controllers/table/table.controller';
import { TableItemController } from './controllers/table-item/table-item.controller';
import { UserController } from './controllers/user/user.controller';

import { UserGateway } from './gateways/user/user.gateway';
import { TableItemGateway } from './gateways/table-item/table-item.gateway';

import { DatabaseService } from './services/database/database.service';
import { TableService } from './services/table/table.service';
import { TableItemService } from './services/table-item/table-item.service';
import { UserService } from './services/user/user.service';

@Module({
  imports: [],
  controllers: [
    // Controllers
    TableController,
    TableItemController,
    UserController,
  ],
  providers: [
    // Gateways
    TableItemGateway,
    UserGateway,

    // Services
    DatabaseService,
    TableService,
    TableItemService,
    UserService,
  ],
})
export class AppModule {}
