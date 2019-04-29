import { MongoEntity, MongoId } from './mongo-entity.model';

export class TableJoin extends MongoEntity {
  userId: MongoId;
  tableId: MongoId;
}
