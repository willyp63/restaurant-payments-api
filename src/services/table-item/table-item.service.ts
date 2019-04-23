import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'services/database/database.service';
import { Collection, Db, ObjectId } from 'mongodb';
import { TableItem } from 'models/table-item.model';
import { TABLE_ITEM_COLLECTION_NAME } from 'constants/collection.constants';

@Injectable()
export class TableItemService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  updateTableItemWithId(itemId: string, item: TableItem): Promise<TableItem> {
    return new Promise((resolve) => {
      this._getTableItemCollection().then((collection: Collection<TableItem>) => {
        collection.updateOne(
          { _id: new ObjectId(itemId) },
          { $set: item },
        ).then(() => resolve(item));
      });
    });
  }

  removeTableItem(itemId: string): Promise<void> {
    return new Promise((resolve) => {
      this._getTableItemCollection().then((collection: Collection<TableItem>) => {
        collection.deleteOne({ _id: new ObjectId(itemId) }).then(() => resolve());
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
