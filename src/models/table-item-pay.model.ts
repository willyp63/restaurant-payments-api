import { MongoId } from './mongo-entity.model';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class TableItemPay {
  @Expose()
  @IsNotEmpty()
  tableItemId: MongoId;
}
