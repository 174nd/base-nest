import { PrimaryGeneratedColumn } from "typeorm";

export default class CustomEntity {
  @PrimaryGeneratedColumn('identity', {generatedIdentity: `BY DEFAULT`})
  id: number;
}
