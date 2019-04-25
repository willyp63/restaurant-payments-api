import { Injectable, PipeTransform, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'param' && metadata.metatype === ObjectId) {
      try {
        return new ObjectId(value);
      } catch (e) {
        throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
      }
    }
    return value;
  }
}
