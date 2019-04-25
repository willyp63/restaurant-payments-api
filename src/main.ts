import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ObjectIdPipe } from './pipes/object-id.pipe';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { strategy: 'excludeAll' } }), new ObjectIdPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
