import ConfigEntity from "src/shared/nestjsx/entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Product extends ConfigEntity {

  @Column({ nullable: true })
  productCode: string;

  @Column({ nullable: true })
  productName: string;

  @Column({ nullable: true })
  productDescription: string;

  /////////////////////////////////////////////////////////////////
}
