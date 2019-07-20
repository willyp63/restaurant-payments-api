import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { CRUDService } from '../../abstract/crud-service.abstract';
import { DatabaseService } from '../../services/database/database.service';
import { User, Table } from '../../models';
import { COLLECTION_NAMES } from '../../constants/collection.constants';
import { idToDate } from '../../utils/date.utils';

@Injectable()
export class UserService implements CRUDService<User> {

  add(user: User): Promise<User> {
    return new Promise(resolve => {
      this.databaseService.getUserCollection().then(collection => {
        collection.insertOne(user).then(insertOp => {
          resolve({ ...user, _id: insertOp.insertedId, password: undefined });
        });
      });
    });
  }

  getAll(): Promise<User[]> {
    return new Promise(resolve => {
      this.databaseService.getUserCollection().then(collection => {
        collection.find().toArray().then(users => resolve(users));
      });
    });
  }

  get(userId: ObjectId): Promise<User> {
    return new Promise(resolve => {
      this.databaseService.getUserCollection().then(collection => {
        collection.findOne({ _id: userId }).then(user => resolve(user));
      });
    });
  }

  getByEmailAndPassword(userEmail: string, userPassword: string): Promise<User> {
    return new Promise(resolve => {
      this.databaseService.getUserCollection().then(collection => {
        collection.findOne({ email: userEmail, password: userPassword }).then(user => resolve(user));
      });
    });
  }

  addUserToTable(userId: ObjectId, tableId: ObjectId): Promise<void> {
    return new Promise(resolve => {
      this.databaseService.getTableJoinCollection().then(collection => {
        collection.findOne({ userId, tableId }).then(tableJoin => {
          if (!tableJoin) {
            collection.insertOne({ userId, tableId }).then(() => resolve());
          }
        });
      });
    });
  }

  removeUserFromTable(userId: ObjectId, tableId: ObjectId): Promise<void> {
    return new Promise(resolve => {
      this.databaseService.getTableJoinCollection().then(joinCollection => {
        joinCollection.findOne({ userId, tableId }).then(tableJoin => {
          if (tableJoin) {
            this.databaseService.getTableLeaveCollection().then(leaveCollection => {
              leaveCollection.insertOne({ tableJoinId: tableJoin._id }).then(() => resolve());
            });
          }
        });
      });
    });
  }

  getAllUsersAtTable(tableId: ObjectId): Promise<User[]> {
    return new Promise(resolve => {
      this.databaseService.getTableJoinCollection().then(collection => {
        collection.aggregate([
          // filter by [tableId]
          { $match: { tableId } },
          // join with [TableLeave]s
          {
            $lookup: {
              from: COLLECTION_NAMES.TableLeaves,
              localField: '_id',
              foreignField: 'tableJoinId',
              as: 'tableLeave',
            },
          },
          { $addFields: { tableLeave: { $arrayElemAt: ['$tableLeave', 0] } } },
          // join with [User]s
          {
            $lookup: {
              from: COLLECTION_NAMES.Users,
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          { $addFields: { user: { $arrayElemAt: ['$user', 0] } } },
          // join with [TableItemPay]s and unwind
          {
            $lookup: {
              from: COLLECTION_NAMES.TableItemPays,
              localField: 'user._id',
              foreignField: 'userId',
              as: 'itemPays',
            },
          },
          { $unwind: { path: '$itemPays', preserveNullAndEmptyArrays: true } },
          // join with [TableItem]s
          {
            $lookup: {
              from: COLLECTION_NAMES.TableItems,
              localField: 'itemPays.tableItemId',
              foreignField: '_id',
              as: 'paidForItem',
            },
          },
          { $addFields: { paidForItem: { $arrayElemAt: ['$paidForItem', 0] } } },
          // Only Items at table
          { $match: { $or: [{ paidForItem: { $exists: false } }, { 'paidForItem.tableId': tableId }] } },
          // regroup and format as [User]s
          {
            $group: {
              _id: '$user._id',
              tableJoinId: { $first: '$_id' },
              tableLeaveId: { $first: '$tableLeave._id' },
              firstName: { $first: '$user.firstName' },
              lastName: { $first: '$user.lastName' },
              paidForItems: { $push: '$paidForItem' },
            },
          },
          // format dates
          {
            $project: {
              _id: '$_id',
              joinedTableAt: '$tableJoinId', // converted to date below
              leftTableAt: '$tableLeaveId', // converted to date below
              firstName: '$firstName',
              lastName: '$lastName',
              paidForItems: '$paidForItems',
            },
          },
        ]).toArray().then((users: any[]) => {
          resolve(users.map(user => ({
            ...user,
            joinedTableAt: idToDate(user.joinedTableAt),
            leftTableAt: idToDate(user.leftTableAt),
          })));
        });
      });
    });
  }

  getPastTablesForUser(userId: ObjectId): Promise<Table[]> {
    return new Promise(resolve => {
      this.databaseService.getTableJoinCollection().then(collection => {
        collection.aggregate([
          // filter by [userId]
          { $match: { userId } },
          // join with [Table]s
          {
            $lookup: {
              from: COLLECTION_NAMES.Tables,
              localField: 'tableId',
              foreignField: '_id',
              as: 'table',
            },
          },
          { $addFields: { table: { $arrayElemAt: ['$table', 0] } } },
          { $match: { table: { $exists: true } } },
          // format as [Table]s
          {
            $project: {
              _id: '$table._id',
              name: '$table.name',
              joinedAt: { $convert: { input: '$_id', to: 'date' } },
            },
          },
        ]).toArray().then((tables: any[]) => {
          resolve(tables as Table[]);
        });
      });
    });
  }

  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

}
