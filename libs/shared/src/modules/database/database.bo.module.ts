import { AllBackofficeEntities } from '@lib/shared/entities/backoffice';
import { BACKOFFICE_CONNECTION } from './database.constant';
import { getBoSourceOptions } from '@lib/shared/config';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

const BO_SCHEMA = 'backoffice';

const boConnectionFactory = {
  provide: BACKOFFICE_CONNECTION,
  useFactory: async (): Promise<DataSource> => {
    return new DataSource({
      ...getBoSourceOptions(),
      entities: AllBackofficeEntities,
      migrations: undefined,
      schema: BO_SCHEMA,
      name: BO_SCHEMA,
      poolSize: 1,
    });
  },
};

@Module({
  providers: [boConnectionFactory],
  exports: [BACKOFFICE_CONNECTION],
})
export class BoDatabaseModule {}
