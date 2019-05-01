import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

import { MongoEntity, MongoId, MongoDate } from './mongo-entity.model';
import { User } from './user.model';

export class TableItem extends MongoEntity {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  price: number;

  tableId?: MongoId;
  paidForAt?: MongoDate;
  paidForBy?: Partial<User>;
}
