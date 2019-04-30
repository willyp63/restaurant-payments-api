import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { CRUDService } from '../../abstract/crud-service.abstract';
import { DatabaseService } from '../../services/database/database.service';
import { User } from '../../models/user.model';

@Injectable()
export class UserService implements CRUDService<User> {

  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  add(user: User): Promise<User> {
    return new Promise((resolve) => {
      this.databaseService.getUserCollection().then(collection => {
        collection.insertOne(user).then(insertOp => {
          resolve({ ...user, _id: insertOp.insertedId, password: undefined });
        });
      });
    });
  }

  getAll(): Promise<User[]> {
    return new Promise((resolve) => {
      this.databaseService.getUserCollection().then(collection => {
        collection.find().toArray().then(users => resolve(users));
      });
    });
  }

  get(userId: ObjectId): Promise<User> {
    return new Promise((resolve) => {
      this.databaseService.getUserCollection().then(collection => {
        collection.findOne({ _id: userId }).then(user => resolve(user));
      });
    });
  }
}
