import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { CRUDService } from '../../abstract/crud-service.abstract';
import { DatabaseService } from '../../services/database/database.service';
import { TableItem } from '../../models';

@Injectable()
export class TableItemService implements CRUDService<TableItem> {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  add(item: TableItem, tableId: ObjectId): Promise<TableItem> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.insertOne({ ...item, tableId }).then(insertOp => {
          resolve({ ...item, _id: insertOp.insertedId });
        });
      });
    });
  }

  update(itemId: ObjectId, item: Partial<TableItem>): Promise<void> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.updateOne(
          { _id: itemId },
          { $set: item },
        ).then(() => resolve());
      });
    });
  }

  remove(itemId: ObjectId): Promise<void> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.deleteOne({ _id: itemId }).then(() => resolve());
      });
    });
  }

  getAllByTableId(tableId: ObjectId): Promise<TableItem[]> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.find({ tableId }).toArray().then(() => resolve());
      });
    });
  }

  removeAllByTableId(tableId: ObjectId): Promise<void> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.deleteMany({ tableId }).then(() => resolve());
      });
    });
  }
}
