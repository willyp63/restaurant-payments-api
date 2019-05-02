import { Injectable } from '@nestjs/common';
import { Db, MongoClient, Collection } from 'mongodb';

import { DB_BASE_URL, DB_NAME } from '../../constants/db.constants';
import { COLLECTION_NAMES } from '../../constants/collection.constants';
import {
  TableItemPay,
  TableItem,
  TableJoin,
  Table,
  User,
  TableLeave,
} from '../../models';

@Injectable()
export class DatabaseService {

  private db: Promise<Db> = new Promise((resolve) => {
    MongoClient.connect(DB_BASE_URL, { useNewUrlParser: true }, (err, client) => {
      if (err) { throw err; }
      resolve(client.db(DB_NAME));
    });
  });

  getCollection<T>(collectionName: string): Promise<Collection<T>> {
    return new Promise((resolve) => {
      this.db.then((db: Db) => resolve(db.collection(collectionName)));
    });
  }

  getTableItemPayCollection = () => this.getCollection<TableItemPay>(COLLECTION_NAMES.TableItemPays);
  getTableItemCollection = () => this.getCollection<TableItem>(COLLECTION_NAMES.TableItems);
  getTableJoinCollection = () => this.getCollection<TableJoin>(COLLECTION_NAMES.TableJoins);
  getTableLeaveCollection = () => this.getCollection<TableLeave>(COLLECTION_NAMES.TableLeaves);
  getTableCollection = () => this.getCollection<Table>(COLLECTION_NAMES.Tables);
  getUserCollection = () => this.getCollection<User>(COLLECTION_NAMES.Users);
  
}
