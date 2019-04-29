import { IsNotEmpty, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
import { MongoEntity } from './mongo-entity.model';

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
}
