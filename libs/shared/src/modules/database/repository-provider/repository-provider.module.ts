import { Module } from '@nestjs/common';

import { BoDatabaseModule } from '../database.bo.module';
import { ClinicRepositoryProvider } from './clinic-repository.provider';
import { UserRepositoryProvider } from './user-repository.provider';

@Module({
  imports: [BoDatabaseModule],
  providers: [ClinicRepositoryProvider, UserRepositoryProvider],
  exports: [ClinicRepositoryProvider, UserRepositoryProvider],
})
export class RepositoriesModule { } // TODO: prefix with BO
