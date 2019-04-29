import { Injectable } from '@nestjs/common';

import { CRUDService } from '../../abstract/crud-service.abstract';
import { TableItemPay } from '../../models';
import { DatabaseService } from '../../services/database/database.service';

@Injectable()
export class TableItemPayService implements CRUDService<TableItemPay> {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  add(itemPay: TableItemPay): Promise<TableItemPay> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemPayCollection().then(collection => {
        collection.insertOne(itemPay).then(insertOp => {
          resolve({ ...itemPay, _id: insertOp.insertedId });
        });
      });
    });
  }

  // getAllByTableId(tableId: ObjectId): Promise<TableItemPay[]> {
  //   return new Promise((resolve) => {
  //     this.databaseService.getTableItemPayCollection().then(collection => {
  //       collection.find({ tableId }).toArray().then(itemPays => resolve(itemPays));
  //     });
  //   });
  // }
}
