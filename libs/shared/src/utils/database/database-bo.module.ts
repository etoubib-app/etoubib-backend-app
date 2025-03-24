import { Module, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CONNECTION } from '../constants/app.constant';
import { getTenantConnectionBO } from './connection-bo';

const backofficeConnectionFactory = {
  provide: 'BACKOFFICE_DATA_SOURCE',
  scope: Scope.DEFAULT, // Singleton is usually best for database connections.
  useFactory: async (): Promise<DataSource> => {
    const schemaName = CONNECTION.BO;
    console.log('Initializing backoffice connection for schema:', schemaName);
    return getTenantConnectionBO(schemaName);
  },
};

@Module({
  providers: [backofficeConnectionFactory],
  exports: ['BACKOFFICE_DATA_SOURCE'],
})
export class DatabaseBOModule {}