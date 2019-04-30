import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { DatabaseService } from '../../services/database/database.service';
import { TableJoin } from '../../models';
import { USER_COLLECTION_NAME } from '../../constants/collection.constants';

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

  getAllUsersAtTable(tableId: ObjectId): Promise<TableJoin[]> {
    return new Promise((resolve) => {
      this.databaseService.getTableJoinCollection().then(collection => {
        collection.aggregate([
          {
            $match: { tableId },
          },
          {
            $lookup: {
              from: USER_COLLECTION_NAME,
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $addFields: {
              user: { $arrayElemAt: ['$user', 0] },
            }
          },
          {
            $project: {
              _id: '$user._id',
              joinTableAt: { $toDate: '$_id' },
              firstName: '$user.firstName',
              lastName: '$user.lastName',
            },
          },
        ]).toArray().then(tableJoins => resolve(tableJoins));
      });
    });
  }
}
