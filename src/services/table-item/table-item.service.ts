import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { CRUDService } from '../../abstract/crud-service.abstract';
import { DatabaseService } from '../../services/database/database.service';
import { TableItem } from '../../models';
import { TABLE_ITEM_PAY_COLLECTION_NAME, USER_COLLECTION_NAME, TABLE_ITEM_COLLECTION_NAME } from '../../constants/collection.constants';

@Injectable()
export class TableItemService implements CRUDService<TableItem> {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  add(item: TableItem, tableId: ObjectId): Promise<TableItem> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.insertOne({ ...item, tableId }).then(insertOp => {
          resolve({ ...item, _id: insertOp.insertedId });
        });
      });
    });
  }

  update(itemId: ObjectId, item: Partial<TableItem>): Promise<void> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.updateOne(
          { _id: itemId },
          { $set: item },
        ).then(() => resolve());
      });
    });
  }

  remove(itemId: ObjectId): Promise<void> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.deleteOne({ _id: itemId }).then(() => resolve());
      });
    });
  }

  getAllByTableId(tableId: ObjectId): Promise<TableItem[]> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.aggregate([
          {
            $match: { tableId },
          },
          {
            $lookup: {
              from: TABLE_ITEM_PAY_COLLECTION_NAME,
              localField: '_id',
              foreignField: 'tableItemId',
              as: 'itemPay',
            },
          },
          {
            $addFields: {
              itemPay: { $arrayElemAt: ['$itemPay', 0] },
            }
          },
          {
            $lookup: {
              from: USER_COLLECTION_NAME,
              localField: 'itemPay.userId',
              foreignField: '_id',
              as: 'payingUser',
            },
          },
          {
            $addFields: {
              paidForAt: { $toDate: '$itemPay._id' },
              paidForBy: {
                $let: {
                  vars: {
                    payingUser: { $arrayElemAt: ['$payingUser', 0] },
                  },
                  in: {
                    firstName: '$$payingUser.firstName',
                    lastName: '$$payingUser.lastName',
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: '$_id',
              name: '$name',
              price: '$price',
              paidForAt: '$paidForAt',
              paidForBy: '$paidForBy',
            },
          },
        ]).toArray().then(items => resolve(items));

        //collection.find({ tableId }).toArray().then(() => resolve());
      });
    });
  }

  removeAllByTableId(tableId: ObjectId): Promise<void> {
    return new Promise((resolve) => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.deleteMany({ tableId }).then(() => resolve());
      });
    });
  }
}
