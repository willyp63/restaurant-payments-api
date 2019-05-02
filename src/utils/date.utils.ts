import { ObjectId } from 'mongodb';

export const idToDate = (id: ObjectId | null) => {
  return id ? id.getTimestamp() : null;
}
