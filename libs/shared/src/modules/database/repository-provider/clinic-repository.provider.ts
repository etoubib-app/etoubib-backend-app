import { DataSource, Repository } from 'typeorm';

import { BoClinic } from '../../../entities';
import { BACKOFFICE_CONNECTION } from '../database.constant';

export const CLINIC_REPOSITORY_TOKEN = 'ClinicRepositoryToken';

export const ClinicRepositoryProvider = {
  provide: CLINIC_REPOSITORY_TOKEN,
  useFactory: (dataSource: DataSource): Repository<BoClinic> => {
    return dataSource.getRepository(BoClinic);
  },
  inject: [BACKOFFICE_CONNECTION],
};
