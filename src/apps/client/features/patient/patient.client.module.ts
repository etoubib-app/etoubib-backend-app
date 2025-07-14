import { Module } from '@nestjs/common';
import { ClientDatabaseModule } from '@lib/shared/modules';
import { PatientsController } from './patient.client.controller';
import { PatientApiService } from './services/patient-api.client.service';
import { JWTAuthModule } from '@lib/shared/modules/jwt-auth';
import { PatientFormApiService } from './services/patient-form-api.client.service';

@Module({
  imports: [ClientDatabaseModule, JWTAuthModule],
  controllers: [PatientsController],
  providers: [PatientApiService, PatientFormApiService],
  exports: [],
})
export class PatientModule {}
