import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { DataSource, EntitySchema, FindOptionsWhere, ObjectType } from 'typeorm';

interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema | string,
    ((validationArguments: ValidationArguments) => FindOptionsWhere<E>),
  ];
}

export abstract class UniqueValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly connection: DataSource) {}

  public async validate<E>(value: string, args: UniqueValidationArguments<E>) {
    const [EntityClass, findCondition = args.property] = args.constraints;

    return (
      (await this.connection.getRepository(EntityClass).countBy(
        typeof findCondition === 'function'
            ? findCondition(args)
            : {
                [findCondition || args.property]: value,
              },
      )) <= 0
    );
  }

  public defaultMessage(args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `${entity} with the same '${args.property}' already exist`;
  }
}