import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { DatabaseService } from '../../services/database/database.service';
import { TableJoin } from '../../models';

@Injectable()
export class TableJoinService {

  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  addUserToTable(userId: ObjectId, tableId: ObjectId): Promise<TableJoin> {
    return new Promise((resolve) => {
      const tableJoin: TableJoin = { userId, tableId };
      this.databaseService.getTableJoinCollection().then(collection => {
        collection.insertOne(tableJoin).then(insertOp => {
          resolve({ ...tableJoin, _id: insertOp.insertedId });
        });
      });
    });
  }
}
