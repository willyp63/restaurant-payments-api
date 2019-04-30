import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { TableItemPay } from '../../models';
import { DatabaseService } from '../../services/database/database.service';

@Injectable()
export class TableItemPayService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  payForItem(tableItemId: ObjectId, userId: ObjectId): Promise<TableItemPay> {
    return new Promise((resolve) => {
      const tableItemPay: TableItemPay = { userId, tableItemId };
      this.databaseService.getTableItemPayCollection().then(collection => {
        collection.insertOne(tableItemPay).then(insertOp => {
          resolve({ ...tableItemPay, _id: insertOp.insertedId });
        });
      });
    });
  }

  getAllByTableId(tableId: ObjectId): Promise<TableItemPay[]> {
    return new Promise((resolve) => {
      // TODO
      resolve([]);
    });
  }
}
