import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service';
import { Db, Collection, ObjectId, InsertOneWriteOpResult } from 'mongodb';
import { Table } from '../../models/table.model';
import { TableItem } from '../../models/table-item.model';
import { TABLE_COLLECTION_NAME, TABLE_ITEM_COLLECTION_NAME } from '../../constants/collection.constants';

@Injectable()
export class TableService {

  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  addTable(table: Table): Promise<Table> {
    return new Promise((resolve) => {
      this._getTableCollection().then((collection: Collection<Table>) => {
        collection.insertOne(table).then((op: InsertOneWriteOpResult) => {
          resolve({ ...table, _id: op.insertedId });
        });
      });
    });
  }

  getTables(): Promise<Table[]> {
    return new Promise((resolve) => {
      this._getTableCollection().then((collection: Collection<Table>) => {
        collection.find().toArray().then((tables: Table[]) => {
          resolve(tables);
        });
      });
    });
  }

  getTableById(tableId: ObjectId): Promise<Table> {
    return new Promise((resolve) => {
      this._getTableCollection().then((tableCollection: Collection<Table>) => {
        tableCollection.findOne({ _id: tableId }).then((table: Table) => {
          this._getTableItemCollection().then((tableItemCollection: Collection<Table>) => {
            tableItemCollection.find({ tableId }).toArray().then((items: TableItem[]) => {
              resolve({ ...table, items });
            });
          });
        });
      });
    });
  }

  updateTableWithId(tableId: ObjectId, table: Partial<Table>): Promise<void> {
    return new Promise((resolve) => {
      this._getTableCollection().then((tableCollection: Collection<Table>) => {
        tableCollection.updateOne(
          { _id: tableId },
          { $set: table },
        ).then(() => resolve());
      });
    });
  }

  addItemToTable(tableId: ObjectId, item: TableItem): Promise<TableItem> {
    return new Promise((resolve) => {
      this._getTableItemCollection().then((collection: Collection<TableItem>) => {
        collection.insertOne({ ...item, tableId }).then((op: InsertOneWriteOpResult) => {
          resolve({ ...item, _id: op.insertedId });
        });
      });
    });
  }

  removeTable(tableId: ObjectId): Promise<void> {
    return new Promise((resolve) => {
      this._getTableCollection().then((tableCollection: Collection<Table>) => {
        tableCollection.deleteOne({ _id: tableId }).then(() => {
          this._getTableItemCollection().then((itemCollection: Collection<TableItem>) => {
            itemCollection.deleteMany({ tableId }).then(() => resolve());
          });
        });
      });
    });
  }

  private _getTableCollection(): Promise<Collection<Table>> {
    return new Promise((resolve) => {
      this.databaseService.getDB().then((db: Db) => resolve(db.collection(TABLE_COLLECTION_NAME)));
    });
  }

  private _getTableItemCollection(): Promise<Collection<TableItem>> {
    return new Promise((resolve) => {
      this.databaseService.getDB().then((db: Db) => resolve(db.collection(TABLE_ITEM_COLLECTION_NAME)));
    });
  }
}
