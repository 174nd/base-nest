import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  constructor(

    readonly connection: Connection,
    private service: ProductService,
  ) {connection.subscribers.push(this);}
  listenTo(): any {
    return Product;
  }

  // async afterInsert(event: InsertEvent<Product>) {
  //   await event.queryRunner.commitTransaction();
  //   await event.queryRunner.startTransaction();
  //   console.log(await this.service.getOneData({query: {id: event.entity.id}}));
  // }
  
  // async beforeUpdate(event: UpdateEvent<Product>){
  //   console.log(await this.service.getOneData({query: {id: event.entity.id}}));
  // }
  
  // async afterUpdate(event: UpdateEvent<Product>){
  //   console.log(await this.service.getOneData({query: {id: event.entity.id}}));
  // }

  // async beforeRemove(event: RemoveEvent<Product>) {
  //   console.log(await this.service.getOneData({query: {id: event.entity.id}}));
  // }
}