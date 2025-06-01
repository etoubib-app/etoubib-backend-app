import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { getDBSourceOptions } from './typeorm.config';
config();

const configService = new ConfigService();

export const getClientSourceOptions = (
  innerConfigService: ConfigService = configService,
): PostgresConnectionOptions => ({
  ...getDBSourceOptions(innerConfigService),
  // entities: CLIENT_ENTITIES,
  entities: [
    path.resolve(
      __dirname,
      '../entities/client/*.client.entity.{js,ts}', // works for dev and prod
    ),
  ],
  migrations: [
    path.resolve(
      __dirname,
      '../migrations/client/*-migration.{js,ts}', // works for dev and prod
    ),
  ],
  uuidExtension: 'uuid-ossp',
  // migrations: ['libs/shared/src/migrations/client/*-migration.ts'],
});

const CoDataSource = new DataSource(getClientSourceOptions());

export default CoDataSource;
