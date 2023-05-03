import { IsNotEmpty, Validate, ValidateIf } from "class-validator";
import { ProductExists } from "../validator/productExist";

export class CreateProductDto {
  
  productCode: string;

  @IsNotEmpty()
  // @Validate(IsCustomerExists) // Menggunakan validasi
  @ProductExists({ message: 'email not found' })
  productName: string;

  @IsNotEmpty()
  productDescription: string;
}
