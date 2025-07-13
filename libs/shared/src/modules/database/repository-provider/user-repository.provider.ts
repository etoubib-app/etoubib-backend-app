import { DataSource, Repository } from 'typeorm';

import { BoUserEntity } from '../../../entities/backoffice';
import { BACKOFFICE_CONNECTION } from '../database.constant';

// TODO: prefix with BO

export const USER_REPOSITORY_TOKEN = 'UserRepositoryToken';

export const UserRepositoryProvider = {
  provide: USER_REPOSITORY_TOKEN,
  useFactory: (dataSource: DataSource): Repository<BoUserEntity> => {
    return dataSource.getRepository(BoUserEntity);
  },
  inject: [BACKOFFICE_CONNECTION],
};
