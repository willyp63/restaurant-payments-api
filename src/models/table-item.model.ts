import { MongoEntity, MongoId } from './mongo-entity.model';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class TableItem extends MongoEntity {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  price: number;

  tableId?: MongoId;
}
