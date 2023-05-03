import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export function postgres(): TypeOrmModuleOptions {
  return {
    type          : 'postgres',
    host          : process.env.POSTGRES_HOST || 'localhost',
    port          : parseInt(process.env.POSTGRES_PORT) || 5432,
    username      : process.env.POSTGRES_USERNAME || 'root',
    password      : process.env.POSTGRES_PASSWORD || 'root',
    database      : process.env.POSTGRES_DATABASE || 'infinitec',
    logging       : process.env.POSTGRES_LOGGING === 'true',
    schema        : process.env.POSTGRES_SCHEMA || 'public',
    synchronize   : process.env.POSTGRES_SYNCHRONIZE === 'true',
    entities      : [join(__dirname, '..', process.env.POSTGRES_ENTITIES || '**/*.entity{.ts,.js}')],
    migrationsRun : process.env.POSTGRES_MIGRATION_RUN === 'true',
  };
}

// export const postgres: TypeOrmModuleOptions = {
//     type          : 'postgres',
//     host          : process.env.POSTGRES_HOST || 'localhost',
//     port          : parseInt(process.env.POSTGRES_PORT) || 5432,
//     username      : process.env.POSTGRES_USERNAME || 'root',
//     password      : process.env.POSTGRES_PASSWORD || 'root',
//     database      : process.env.POSTGRES_DATABASE || 'infinitec',
//     logging       : process.env.POSTGRES_LOGGING === 'true',
//     schema        : process.env.POSTGRES_SCHEMA || 'public',
//     synchronize   : process.env.POSTGRES_SYNCHRONIZE === 'true',
//     entities      : [join(__dirname, '..', process.env.POSTGRES_ENTITIES || '**/*.entity{.ts,.js}')],
//     migrationsRun : process.env.POSTGRES_MIGRATION_RUN === 'true',
// }