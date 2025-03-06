import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { AllCoreEntities } from '../entities/core';
import { getDBSourceOptions } from './typeorm.config';
config();

const configService = new ConfigService();

export const getCoreSourceOptions = (
  innerConfigService: ConfigService = configService,
): PostgresConnectionOptions => ({
  ...getDBSourceOptions(innerConfigService),
  entities: AllCoreEntities,
  migrations: ['libs/shared/src/migrations/core/*-migration.ts'],
});

const CoDataSource = new DataSource(getCoreSourceOptions());

export default CoDataSource;
