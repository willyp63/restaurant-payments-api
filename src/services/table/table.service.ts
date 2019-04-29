import { Injectable } from '@nestjs/common';
import { ObjectId, InsertOneWriteOpResult } from 'mongodb';

import { CRUDService } from '../../abstract/crud-service.abstract';
import { DatabaseService } from '../../services/database/database.service';
import { TableItemService } from '../../services/table-item/table-item.service';
import { Table } from '../../models';
import { TABLE_ITEM_COLLECTION_NAME } from 'constants/collection.constants';

@Injectable()
export class TableService implements CRUDService<Table> {

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tableItemService: TableItemService,
  ) { }

  get(tableId: ObjectId): Promise<Table> {
    return new Promise((resolve) => {
      this.databaseService.getTableCollection().then(tableCollection => {
        tableCollection.aggregate([
          {
            $match: { _id: tableId },
          },
          {
            $lookup: {
              from: TABLE_ITEM_COLLECTION_NAME,
              localField: '_id',
              foreignField: 'tableId',
              as: 'items',
            },
          },
        ]).toArray().then(tables => resolve(tables[0]));
      });
    });
  }

  getAll(): Promise<Table[]> {
    return new Promise((resolve) => {
      this.databaseService.getTableCollection().then(tableCollection => {
        tableCollection.find().toArray().then((tables: Table[]) => {
          resolve(tables);
        });
      });
    });
  }

  add(table: Table): Promise<Table> {
    return new Promise((resolve) => {
      this.databaseService.getTableCollection().then(tableCollection => {
        tableCollection.insertOne(table).then((op: InsertOneWriteOpResult) => {
          resolve({ ...table, _id: op.insertedId });
        });
      });
    });
  }

  update(tableId: ObjectId, table: Partial<Table>): Promise<void> {
    return new Promise((resolve) => {
      this.databaseService.getTableCollection().then(tableCollection => {
        tableCollection.updateOne(
          { _id: tableId },
          { $set: table },
        ).then(() => resolve());
      });
    });
  }

  remove(tableId: ObjectId): Promise<void> {
    return new Promise((resolve) => {
      // TODO: do these 2 lookups in parallel instead of series
      this.databaseService.getTableCollection().then(tableCollection => {
        tableCollection.deleteOne({ _id: tableId }).then(() => {
          this.tableItemService.removeAllByTableId(tableId).then(() => resolve());
        });
      });
    });
  }
}
