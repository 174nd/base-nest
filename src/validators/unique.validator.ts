import { ValidatorConstraint } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UniqueValidator } from './abstract-unique.validator';

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class Unique extends UniqueValidator {
  constructor(@InjectDataSource() protected readonly connection: DataSource) {
    super(connection);
  }
}