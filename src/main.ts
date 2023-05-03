import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(json({ limit: '50mb' }));
  // await app.connectMicroservice<MicroserviceOptions>(rabbitmqOptions());
  // await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
