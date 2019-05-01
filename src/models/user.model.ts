import { IsNotEmpty, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';

import { MongoEntity, MongoDate } from './mongo-entity.model';
import { TableItem } from './table-item.model';

export class User extends MongoEntity {
  @Expose()
  @IsNotEmpty()
  firstName: string;

  @Expose()
  @IsNotEmpty()
  lastName: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  password: string;

  joinedTableAt?: MongoDate;
  paidForItems?: TableItem[];
}
