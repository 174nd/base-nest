import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ProductSubscriber } from './product.subscriber';
import { IsEmailUserAlreadyExistConstraint } from './validator/productExist';
import { Unique } from 'src/validators';

@Module({
  imports:[
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductSubscriber, Unique],
  exports: [ProductService],
})
export class ProductModule {}
