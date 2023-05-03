import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgres } from './config/database';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({useFactory: postgres}),
    // ClientsModule.register([rabbitmq({name: 'core', queue: 'core'})]),

    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
