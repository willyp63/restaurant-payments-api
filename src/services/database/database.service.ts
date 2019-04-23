import { Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

const DB_NAME = 'restaurant-payments';
const DB_URL = `mongodb://localhost:27017/${DB_NAME}`;

@Injectable()
export class DatabaseService {
  private _db: Promise<Db> = new Promise((resolve, reject) => {
    MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, client) => {
      if (err) { reject(err); }
      else { resolve(client.db(DB_NAME)); }
    });
  });

  getDB(): Promise<Db> {
    return this._db;
  }
}
