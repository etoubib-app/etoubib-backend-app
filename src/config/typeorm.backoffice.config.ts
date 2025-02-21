import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const getBoSourceOptions = (
  innerConfigService: ConfigService = configService,
): DataSourceOptions => ({
  type: 'postgres',
  url: innerConfigService.get<string>('TYPEORM_URL'),
  synchronize: false,
  entities: ['**/apps/backoffice/**/*.entity.ts'],
  migrations: ['src/database/migrations/backoffice/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

const AppDataSource = new DataSource(getBoSourceOptions());

export default AppDataSource;
