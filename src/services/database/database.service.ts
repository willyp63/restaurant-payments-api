import { Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

const DB_NAME = process.env.MONGODB_URI ? '' : 'restaurant-payments';
const DB_BASE_URL =  process.env.MONGODB_URI || 'mongodb://localhost:27017';

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
}
