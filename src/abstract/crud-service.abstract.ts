import { ObjectId } from 'mongodb';

export interface CRUDService<T> {
  get?(entityId: ObjectId, ...args: any[]): Promise<T>;
  getAll?(...args: any[]): Promise<T[]>;
  add?(entity: T, ...args: any[]): Promise<T>;
  update?(entityId: ObjectId, partialEntity: Partial<T>, ...args: any[]): Promise<void>;
  remove?(entityId: ObjectId, ...args: any[]): Promise<void>;
}
