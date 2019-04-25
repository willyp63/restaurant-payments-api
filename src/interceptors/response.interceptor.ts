import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MongoEntity } from '../models/mongo-entity.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: MongoEntity | MongoEntity[]) => {
        if (!data) { return data; }
        if (Array.isArray(data)) { return data.map(this.addCreatedAtField); }
        return this.addCreatedAtField(data);
      }),
    );
  }

  private addCreatedAtField(entity: MongoEntity): MongoEntity {
    if (!entity._id) { return entity; }

    const objectId = entity._id instanceof ObjectId ? entity._id : new ObjectId(entity._id);
    const createdAtDate = objectId.getTimestamp();
    entity.createdAt = createdAtDate.toLocaleDateString() + ' @ ' + createdAtDate.toLocaleTimeString();
    return entity;
  }
}
