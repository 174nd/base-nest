import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProductService } from '../product.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsProductExists implements ValidatorConstraintInterface {
  constructor(private productService: ProductService) {}

  validate(name: string | undefined) {
    console.log(this.productService)
    return this.productService.getOneData({query: {productName: name}}).then((product) => {
      return product !== undefined;
    });
  }
}

export function ProductExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProductExists,
      async: true
    });
  };
};