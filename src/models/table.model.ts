import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

import { MongoEntity, MongoDate } from './mongo-entity.model';

export class Table extends MongoEntity {
  @Expose()
  @IsNotEmpty()
  name: string;

  joinedAt?: MongoDate;
}
