import { Module } from '@nestjs/common';
import { DatabaseService } from './services/database/database.service';
import { TableService } from './services/table/table.service';
import { TableController } from './controllers/table/table.controller';

@Module({
  imports: [],
  controllers: [TableController],
  providers: [DatabaseService, TableService],
})
export class AppModule {}
