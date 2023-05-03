import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CustomService } from 'src/shared/nestjsx/service';
import { GetProduct } from './model/product.model';

@Injectable()
export class ProductService extends CustomService<Product, GetProduct> {
  constructor(
    @InjectRepository(Product) repo: Repository<Product>,
  ){super(repo)}

  ////////////////////////////////////////////////////////

}
