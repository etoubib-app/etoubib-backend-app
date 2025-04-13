import { AllBackofficeEntities } from '@lib/shared/entities/backoffice';
import { BACKOFFICE_CONNECTION } from './database.constant';
import { getBoSourceOptions } from '@lib/shared/config';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const BO_SCHEMA_NAME = "backoffice"
const boConnectionFactory = {
  provide: BACKOFFICE_CONNECTION,
  useFactory: async (): Promise<DataSource> => {
    return new DataSource({
      ...getBoSourceOptions(),
      entities: AllBackofficeEntities,
      migrations: undefined,
      schema: BO_SCHEMA_NAME,
      name: BO_SCHEMA_NAME,
      poolSize: 1,
    });
  },
};

@Module({
  providers: [boConnectionFactory],
  exports: [BACKOFFICE_CONNECTION],
})
export class BoDatabaseModule { }