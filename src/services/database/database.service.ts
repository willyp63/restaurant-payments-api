import { Injectable } from '@nestjs/common';
import { Db, MongoClient, Collection } from 'mongodb';

import {
  TableItemPay,
  TableItem,
  TableJoin,
  Table,
  User,
} from '../../models';
import {
  DB_BASE_URL,
  DB_NAME,
  TABLE_ITEM_COLLECTION_NAME,
  TABLE_ITEM_PAY_COLLECTION_NAME,
  TABLE_JOIN_COLLECTION_NAME,
  TABLE_COLLECTION_NAME,
  USER_COLLECTION_NAME,
} from '../../constants/collection.constants';

@Injectable()
export class DatabaseService {
  private db: Promise<Db> = new Promise((resolve) => {
    MongoClient.connect(DB_BASE_URL, { useNewUrlParser: true }, (err, client) => {
      if (err) { throw err; }
      resolve(client.db(DB_NAME));
    });
  });

  getDB(): Promise<Db> {
    return this.db;
  }

  getCollection<T>(collectionName: string): Promise<Collection<T>> {
    return new Promise((resolve) => {
      this.getDB().then((db: Db) => resolve(db.collection(collectionName)));
    });
  }

  getTableItemPayCollection() { return this.getCollection<TableItemPay>(TABLE_ITEM_PAY_COLLECTION_NAME); }
  getTableItemCollection() { return this.getCollection<TableItem>(TABLE_ITEM_COLLECTION_NAME); }
  getTableJoinCollection() { return this.getCollection<TableJoin>(TABLE_JOIN_COLLECTION_NAME); }
  getTableCollection() { return this.getCollection<Table>(TABLE_COLLECTION_NAME); }
  getUserCollection() { return this.getCollection<User>(USER_COLLECTION_NAME); }
}
