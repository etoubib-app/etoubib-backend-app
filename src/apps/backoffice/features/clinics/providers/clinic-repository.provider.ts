import { BoClinic } from '@lib/shared';
import { BACKOFFICE_CONNECTION } from '@lib/shared/modules/database/database.constant';
import { DataSource, Repository } from 'typeorm';

export const ClinicRepositoryProvider = {
  provide: 'ClinicRepositoryToken',
  useFactory: (dataSource: DataSource): Repository<BoClinic> => {
    return dataSource.getRepository(BoClinic);
  },
  inject: [BACKOFFICE_CONNECTION],
};