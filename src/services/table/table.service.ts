import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'services/database/database.service';
import { Db, Collection, ObjectId } from 'mongodb';
import { Table } from 'models/table.model';
import { TableItem } from 'models/table-item.model';

const TABLE_COLLECTION_NAME = 'tables';
const TABLE_ITEM_COLLECTION_NAME = 'table-items';

@Injectable()
export class TableService {

  constructor(
    private readonly _databaseService: DatabaseService,
  ) {}

  addTable(table: Table): Promise<void> {
    return new Promise((resolve) => {
      this._getTableCollection().then((collection: Collection<Table>) => {
        collection.insertOne(table).then(() => resolve());
      });
    });
  }

  getTables(): Promise<Table[]> {
    return new Promise((resolve) => {
      this._getTableCollection().then((collection: Collection<Table>) => {
        collection.find().toArray().then((tables: Table[]) => resolve(tables));
      });
    });
  }

  getTableById(tableId: string): Promise<Table> {
    return new Promise((resolve) => {
      this._getTableCollection().then((tableCollection: Collection<Table>) => {
        tableCollection.findOne({ _id: new ObjectId(tableId) }).then((table: Table) => {
          this._getTableItemCollection().then((tableItemCollection: Collection<Table>) => {
            tableItemCollection.find({ table_id: new ObjectId(tableId) }).toArray().then((items: TableItem[]) => {
              resolve({ ...table, items });
            });
          });
        });
      });
    });
  }

  addItemToTable(tableId: string, item: TableItem): Promise<void> {
    return new Promise((resolve) => {
      this._getTableItemCollection().then((collection: Collection<TableItem>) => {
        collection.insertOne({ ...item, table_id: new ObjectId(tableId) }).then(() => resolve());
      });
    });
  }

  private _getTableCollection(): Promise<Collection<Table>> {
    return new Promise((resolve) => {
      this._databaseService.getDB().then((db: Db) => {
        resolve(db.collection(TABLE_COLLECTION_NAME));
      });
    });
  }

  private _getTableItemCollection(): Promise<Collection<Table>> {
    return new Promise((resolve) => {
      this._databaseService.getDB().then((db: Db) => {
        resolve(db.collection(TABLE_ITEM_COLLECTION_NAME));
      });
    });
  }
}
