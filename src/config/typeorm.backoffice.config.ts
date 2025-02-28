import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const getBoSourceOptions = (
  innerConfigService: ConfigService = configService,
): PostgresConnectionOptions => ({
  type: 'postgres',
  url: innerConfigService.get<string>('TYPEORM_URL'),
  synchronize: false,
  entities: ['**/apps/backoffice/**/*.entity.ts'],
  migrations: ['src/database/migrations/backoffice/*-migration.ts'],
  migrationsRun: false,
  logging: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const BoDataSource = new DataSource(getBoSourceOptions());

export default BoDataSource;
