import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service';
import { Db, Collection, ObjectId, InsertOneWriteOpResult } from 'mongodb';
import { Table } from '../../models/table.model';
import { TableItem } from '../../models/table-item.model';
import { addCreatedAtField } from '../../utils/created-at.util';
import { addIdField } from '../../utils/id.utils';
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
          addIdField(table, op.insertedId);
          addCreatedAtField(table);
          resolve(table);
        });
      });
    });
  }

  getTables(): Promise<Table[]> {
    return new Promise((resolve) => {
      this._getTableCollection().then((collection: Collection<Table>) => {
        collection.find().toArray().then((tables: Table[]) => {
          tables.forEach(addCreatedAtField);
          resolve(tables);
        });
      });
    });
  }

  getTableById(tableId: string): Promise<Table> {
    return new Promise((resolve) => {
      this._getTableCollection().then((tableCollection: Collection<Table>) => {
        tableCollection.findOne({ _id: new ObjectId(tableId) }).then((table: Table) => {
          this._getTableItemCollection().then((tableItemCollection: Collection<Table>) => {
            tableItemCollection.find({ table_id: new ObjectId(tableId) }).toArray().then((items: TableItem[]) => {
              addCreatedAtField(table);
              resolve({ ...table, items });
            });
          });
        });
      });
    });
  }

  updateTableWithId(tableId: string, table: Table): Promise<Table> {
    return new Promise((resolve) => {
      this._getTableCollection().then((tableCollection: Collection<Table>) => {
        tableCollection.updateOne(
          { _id: new ObjectId(tableId) },
          { $set: table },
        ).then(() => resolve(table));
      });
    });
  }

  addItemToTable(tableId: string, item: TableItem): Promise<TableItem> {
    return new Promise((resolve) => {
      this._getTableItemCollection().then((collection: Collection<TableItem>) => {
        collection.insertOne({ ...item, table_id: new ObjectId(tableId) }).then((op: InsertOneWriteOpResult) => {
          addIdField(item, op.insertedId);
          resolve(item);
        });
      });
    });
  }

  removeTable(tableId: string): Promise<void> {
    return new Promise((resolve) => {
      this._getTableCollection().then((tableCollection: Collection<Table>) => {
        tableCollection.deleteOne({ _id: new ObjectId(tableId) }).then(() => {
          this._getTableItemCollection().then((itemCollection: Collection<TableItem>) => {
            itemCollection.deleteMany({ table_id: new ObjectId(tableId) }).then(() => resolve());
          });
        });
      });
    });
  }

  private _getTableCollection(): Promise<Collection<Table>> {
    return new Promise((resolve) => {
      this.databaseService.getDB().then((db: Db) => {
        resolve(db.collection(TABLE_COLLECTION_NAME));
      });
    });
  }

  private _getTableItemCollection(): Promise<Collection<TableItem>> {
    return new Promise((resolve) => {
      this.databaseService.getDB().then((db: Db) => {
        resolve(db.collection(TABLE_ITEM_COLLECTION_NAME));
      });
    });
  }
}
