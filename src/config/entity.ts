import CustomEntity from "src/shared/nestjsx/entity";
import { PrimaryGeneratedColumn } from "typeorm";

export default class ConfigEntity extends CustomEntity {
  @PrimaryGeneratedColumn('identity', {generatedIdentity: `BY DEFAULT`})
  id: number;
}
