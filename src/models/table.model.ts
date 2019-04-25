import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { TableItem } from './table-item.model';
import { MongoEntity } from './mongo-entity.model';

export class Table extends MongoEntity {
  @Expose()
  @IsNotEmpty()
  name: string;

  items?: TableItem[];
}
