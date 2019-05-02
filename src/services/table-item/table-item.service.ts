import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { CRUDService } from '../../abstract/crud-service.abstract';
import { DatabaseService } from '../../services/database/database.service';
import { TableItem } from '../../models';
import { COLLECTION_NAMES } from '../../constants/collection.constants';

@Injectable()
export class TableItemService implements CRUDService<TableItem> {

  add(item: TableItem, tableId: ObjectId): Promise<TableItem> {
    return new Promise(resolve => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.insertOne({ ...item, tableId }).then(insertOp => {
          resolve({ ...item, _id: insertOp.insertedId });
        });
      });
    });
  }

  update(tableItemId: ObjectId, item: Partial<TableItem>): Promise<void> {
    return new Promise(resolve => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.updateOne(
          { _id: tableItemId },
          { $set: item },
        ).then(() => resolve());
      });
    });
  }

  remove(tableItemId: ObjectId): Promise<void> {
    return new Promise(resolve => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.deleteOne({ _id: tableItemId }).then(() => resolve());
      });
    });
  }

  payForItem(tableItemId: ObjectId, userId: ObjectId): Promise<void> {
    return new Promise(resolve => {
      this.databaseService.getTableItemPayCollection().then(collection => {
        collection.insertOne({ userId, tableItemId }).then(() => resolve());
      });
    });
  }

  getAllByTableId(tableId: ObjectId): Promise<TableItem[]> {
    return new Promise(resolve => {
      this.databaseService.getTableItemCollection().then(collection => {
        collection.aggregate([
          // filter by [tableId]
          { $match: { tableId } },
          // join with [TableItemPay]s
          {
            $lookup: {
              from: COLLECTION_NAMES.TableItemPays,
              localField: '_id',
              foreignField: 'tableItemId',
              as: 'itemPay',
            },
          },
          { $addFields: { itemPay: { $arrayElemAt: ['$itemPay', 0] } } },
          // join with [User]s
          {
            $lookup: {
              from: COLLECTION_NAMES.Users,
              localField: 'itemPay.userId',
              foreignField: '_id',
              as: 'payingUser',
            },
          },
          { $addFields: { payingUser: { $arrayElemAt: ['$payingUser', 0] } } },
          // format as [TableItem]s
          {
            $project: {
              _id: '$_id',
              name: '$name',
              price: '$price',
              paidForAt: '$itemPay._id', // converted to date below
              paidForBy: {
                _id: '$payingUser._id',
                firstName: '$payingUser.firstName',
                lastName: '$payingUser.lastName',
              },
            },
          },
        ]).toArray().then((items: any[]) => {
          resolve(items.map(item => ({
            ...item,
            paidForAt: (item.paidForAt as ObjectId).getTimestamp(),
          })));
        });
      });
    });
  }

  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

}
