import { IsNotEmpty, Validate, ValidateIf } from "class-validator";
import { IsEmailUserAlreadyExist } from "../validator/productExist";
import { Product } from "../entities/product.entity";
import { Unique } from "src/validators";

export class CreateProductDto {
  
  productCode: string;

  @IsNotEmpty()
  @Validate(Unique, [Product]) // Menggunakan validasi
  // @ProductExists({ message: 'email not found' })
  // @IsEmailUserAlreadyExist()
  productName: string;

  @IsNotEmpty()
  productDescription: string;
}
