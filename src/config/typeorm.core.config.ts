import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const getCoreSourceOptions = (
  innerConfigService: ConfigService = configService,
): PostgresConnectionOptions => ({
  type: 'postgres',
  url: innerConfigService.get<string>('TYPEORM_URL'),
  synchronize: false,
  entities: ['**/apps/core/**/*.entity.ts'],
  migrations: ['src/database/migrations/core/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

const CoDataSource = new DataSource(getCoreSourceOptions());

export default CoDataSource;
