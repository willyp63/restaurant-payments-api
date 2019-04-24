import { Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

const DB_NAME = 'restaurant-payments';
const DB_BASE_URL =  process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_FULL_URL =  `${DB_BASE_URL}/${DB_NAME}`;

@Injectable()
export class DatabaseService {
  private _db: Promise<Db> = new Promise((resolve, reject) => {
    MongoClient.connect(DB_FULL_URL, { useNewUrlParser: true }, (err, client) => {
      if (err) { reject(err); }
      else { resolve(client.db(DB_NAME)); }
    });
  });

  getDB(): Promise<Db> {
    return this._db;
  }
}
