import { Module } from '@nestjs/common';
import { ClientDatabaseModule } from '@lib/shared/modules';
import { PatientsController } from './patient.client.controller';
import { PatientsApiService } from './services/patients-api.client.service';
import { ClientAuthModule } from '../auth/auth.client.module';

@Module({
  imports: [ClientDatabaseModule, ClientAuthModule],
  controllers: [PatientsController],
  providers: [PatientsApiService],
  exports: [],
})
export class PatientModule { }
