import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { DatabaseService } from '../../services/database/database.service';
import { TableJoin, TableLeave, User } from '../../models';
import { USER_COLLECTION_NAME, TABLE_LEAVE_COLLECTION_NAME } from '../../constants/collection.constants';

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

  removeUserFromTable(userId: ObjectId, tableId: ObjectId): Promise<TableLeave> {
    return new Promise((resolve) => {
      this.databaseService.getTableJoinCollection().then(joinCollection => {
        joinCollection.findOne({ userId, tableId }).then(tableJoin => {
          this.databaseService.getTableLeaveCollection().then(leaveCollection => {
            const tableLeave: TableLeave = { tableJoinId: tableJoin._id };
            leaveCollection.insertOne(tableLeave).then(insertOp => {
              resolve({ ...tableLeave, _id: insertOp.insertedId });
            });
          });
        });
      });
    });
  }

  getAllUsersAtTable(tableId: ObjectId): Promise<User[]> {
    return new Promise((resolve) => {
      this.databaseService.getTableJoinCollection().then(collection => {
        collection.aggregate([
          {
            $match: { tableId },
          },
          {
            $lookup: {
              from: TABLE_LEAVE_COLLECTION_NAME,
              localField: '_id',
              foreignField: 'tableJoinId',
              as: 'tableLeave',
            },
          },
          {
            $addFields: {
              didLeave: { $gt: [ { $size: "$tableLeave" }, 0 ] },
            }
          },
          {
            $match: { didLeave: false },
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
              joinedTableAt: { $toDate: '$_id' },
              firstName: '$user.firstName',
              lastName: '$user.lastName',
            },
          },
        ]).toArray().then((user: any[]) => resolve(user));
      });
    });
  }

  getAllUsersThatLeftTable(tableId: ObjectId): Promise<User[]> {
    return new Promise((resolve) => {
      this.databaseService.getTableJoinCollection().then(collection => {
        collection.aggregate([
          {
            $match: { tableId },
          },
          {
            $lookup: {
              from: TABLE_LEAVE_COLLECTION_NAME,
              localField: '_id',
              foreignField: 'tableJoinId',
              as: 'tableLeave',
            },
          },
          {
            $addFields: {
              didLeave: { $gt: [ { $size: "$tableLeave" }, 0 ] },
            }
          },
          {
            $addFields: {
              tableLeave: { $arrayElemAt: ['$tableLeave', 0] },
            }
          },
          {
            $match: { didLeave: true },
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
              joinedTableAt: { $toDate: '$_id' },
              leftTableAt: { $toDate: '$tableLeave._id' },
              firstName: '$user.firstName',
              lastName: '$user.lastName',
            },
          },
        ]).toArray().then((users: any[]) => resolve(users));
      });
    });
  }
}
