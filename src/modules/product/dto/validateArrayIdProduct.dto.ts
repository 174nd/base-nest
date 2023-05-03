import { ArrayNotEmpty } from 'class-validator';


export class validateArrayIdProductDto {
  @ArrayNotEmpty()
  id: number[];
}
