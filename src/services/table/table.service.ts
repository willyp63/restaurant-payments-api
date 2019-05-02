import { Injectable } from '@nestjs/common';
import { ObjectId, InsertOneWriteOpResult } from 'mongodb';

import { CRUDService } from '../../abstract/crud-service.abstract';
import { DatabaseService } from '../../services/database/database.service';
import { Table } from '../../models';

@Injectable()
export class TableService implements CRUDService<Table> {

  get(tableId: ObjectId): Promise<Table> {
    return new Promise(resolve => {
      this.databaseService.getTableCollection().then(tableCollection => {
        tableCollection.findOne({ _id: tableId}).then(table => resolve(table));
      });
    });
  }

  getAll(): Promise<Table[]> {
    return new Promise(resolve => {
      this.databaseService.getTableCollection().then(tableCollection => {
        tableCollection.find().toArray().then((tables: Table[]) => {
          resolve(tables);
        });
      });
    });
  }

  add(table: Table): Promise<Table> {
    return new Promise(resolve => {
      this.databaseService.getTableCollection().then(tableCollection => {
        tableCollection.insertOne(table).then((op: InsertOneWriteOpResult) => {
          resolve({ ...table, _id: op.insertedId });
        });
      });
    });
  }

  update(tableId: ObjectId, table: Partial<Table>): Promise<void> {
    return new Promise(resolve => {
      this.databaseService.getTableCollection().then(tableCollection => {
        tableCollection.updateOne(
          { _id: tableId },
          { $set: table },
        ).then(() => resolve());
      });
    });
  }

  remove(tableId: ObjectId): Promise<void> {
    return new Promise(resolve => {
      this.databaseService.getTableCollection().then(tableCollection => {
        tableCollection.deleteOne({ _id: tableId }).then(() => resolve());
        // TODO: delete associated entities
      });
    });
  }

  constructor(
    private readonly databaseService: DatabaseService,
  ) { }
  
}
