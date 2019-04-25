import { Module } from '@nestjs/common';
import { DatabaseService } from './services/database/database.service';
import { TableService } from './services/table/table.service';
import { TableController } from './controllers/table/table.controller';
import { TableItemService } from './services/table-item/table-item.service';
import { TableItemController } from './controllers/table-item/table-item.controller';
import { PaymentGateway } from './gateways/payment.gateway';

@Module({
  imports: [],
  controllers: [TableController, TableItemController],
  providers: [DatabaseService, TableService, TableItemService, PaymentGateway],
})
export class AppModule {}
