import { Clinic } from '@lib/shared';
import { DataSource, Repository } from 'typeorm';

export const ClinicRepositoryProvider = {
  provide: 'ClinicRepositoryToken',
  useFactory: (dataSource: DataSource): Repository<Clinic> => {
    return dataSource.getRepository(Clinic);
  },
  inject: ['BACKOFFICE_DATA_SOURCE'], // Token for your backoffice DataSource
};