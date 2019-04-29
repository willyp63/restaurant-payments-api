import { MongoId, MongoEntity } from './mongo-entity.model';

export class TableItemPay extends MongoEntity {
  userId: MongoId;
  tableId: MongoId;
  tableItemIds: MongoId[];
}
