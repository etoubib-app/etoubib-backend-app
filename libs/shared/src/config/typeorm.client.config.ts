import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { AllClientEntities } from '../entities/client';
import { getDBSourceOptions } from './typeorm.config';
config();

const configService = new ConfigService();

export const getClientSourceOptions = (
  innerConfigService: ConfigService = configService,
): PostgresConnectionOptions => ({
  ...getDBSourceOptions(innerConfigService),
  entities: AllClientEntities,
  migrations: ['libs/shared/src/migrations/client/*-migration.ts'],
});

const CoDataSource = new DataSource(getClientSourceOptions());

export default CoDataSource;
