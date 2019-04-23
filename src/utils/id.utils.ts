import { ObjectId } from 'mongodb';

export const addIdField = (obj: any, id: ObjectId) => {
  // tslint:disable-next-line:no-string-literal
  obj['_id'] = id;
};
