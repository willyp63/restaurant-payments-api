import { MongoEntity, MongoId } from './mongo-entity.model';

export class TableLeave extends MongoEntity {
  tableJoinId: MongoId;
}
