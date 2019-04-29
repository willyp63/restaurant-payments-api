import { Module } from '@nestjs/common';

import { TableController } from './controllers/table/table.controller';
import { TableItemController } from './controllers/table-item/table-item.controller';

import { PaymentGateway } from './gateways/payment.gateway';

import { DatabaseService } from './services/database/database.service';
import { TableService } from './services/table/table.service';
import { TableItemService } from './services/table-item/table-item.service';
import { TableJoinService } from './services/table-join/table-join.service';
import { TableItemPayService } from './services/table-item-pay/table-item-pay.service';
import { UserService } from './services/user/user.service';

@Module({
  imports: [],
  controllers: [
    TableController,
    TableItemController,
  ],
  providers: [
    PaymentGateway,
    DatabaseService,
    TableService,
    TableItemService,
    TableJoinService,
    TableItemPayService,
    UserService,
  ],
})
export class AppModule {}
