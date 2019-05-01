import { ObjectId } from 'mongodb';

export type MongoId = ObjectId | string;
export type MongoDate = Date | string;

export class MongoEntity {
  // tslint:disable-next-line:variable-name
  _id?: MongoId;
  createdAt?: MongoDate;
}
