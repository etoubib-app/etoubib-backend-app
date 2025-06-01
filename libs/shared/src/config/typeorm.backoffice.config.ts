import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { BO_ENTITIES } from '../entities';
import { getDBSourceOptions } from './typeorm.config';
config();

const configService = new ConfigService();

export const getBoSourceOptions = (
  innerConfigService: ConfigService = configService,
): PostgresConnectionOptions => ({
  ...getDBSourceOptions(innerConfigService),
  entities: BO_ENTITIES,
  migrations: ['libs/shared/src/migrations/backoffice/*-migration.ts'],
});

const BoDataSource = new DataSource(getBoSourceOptions());

export default BoDataSource;
