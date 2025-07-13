import { Module } from '@nestjs/common';
import { ClientDatabaseModule } from '@lib/shared/modules';
import { PatientsController } from './patient.client.controller';
import { PatientsApiService } from './services/patients-api.client.service';
import { JWTAuthModule } from '@lib/shared/modules/jwt-auth';

@Module({
  imports: [ClientDatabaseModule, JWTAuthModule],
  controllers: [PatientsController],
  providers: [PatientsApiService],
  exports: [],
})
export class PatientModule { }
