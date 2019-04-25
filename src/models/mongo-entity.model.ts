import { ObjectId } from 'mongodb';

export type MongoId = ObjectId | string;

export class MongoEntity {
  // tslint:disable-next-line:variable-name
  _id: MongoId;
  createdAt?: string;
}
