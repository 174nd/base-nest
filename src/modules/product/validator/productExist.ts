import { Injectable } from "@nestjs/common";
import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { ProductService } from "../product.service";

@ValidatorConstraint({ name: 'isEmailUserAlreadyExist', async: true })
    @Injectable()
    export class IsEmailUserAlreadyExistConstraint
      implements ValidatorConstraintInterface
    {
      constructor(protected readonly productService: ProductService) {}
    
      async validate(text: string) {
        console.log(this.productService);
        return !(await this.productService.getOneData({query: {productName: text}}).then(x => x !== undefined));
      }
    }
    
    export function IsEmailUserAlreadyExist(validationOptions?: ValidationOptions) {
      return function (object: any, propertyName: string) {
        registerDecorator({
          target: object.constructor,
          propertyName: propertyName,
          options: validationOptions,
          constraints: [],
          validator: IsEmailUserAlreadyExistConstraint,
        });
      };
    }