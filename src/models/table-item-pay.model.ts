import { MongoId, MongoEntity } from './mongo-entity.model';

export class TableItemPay extends MongoEntity {
  userId: MongoId;
  tableItemId: MongoId;
}
