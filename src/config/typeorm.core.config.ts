import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const getCoreSourceOptions = (
  innerConfigService: ConfigService = configService,
): DataSourceOptions => ({
  type: 'postgres',
  url: innerConfigService.get<string>('TYPEORM_URL'),
  synchronize: false,
  entities: ['**/apps/core/**/*.entity.ts'],
  migrations: ['src/database/migrations/core/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

const AppDataSource = new DataSource(getCoreSourceOptions());

export default AppDataSource;
