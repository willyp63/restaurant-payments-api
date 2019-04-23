import { ObjectId } from 'mongodb';

export const addCreatedAtField = (obj: any) => {
  // tslint:disable-next-line:no-string-literal
  const createDate = (obj['_id'] as ObjectId).getTimestamp();
  // tslint:disable-next-line:no-string-literal
  obj['createdAt'] = createDate.toLocaleDateString() + ' @ ' + createDate.toLocaleTimeString();
};
