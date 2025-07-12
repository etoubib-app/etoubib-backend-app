import { Module } from '@nestjs/common';

import { ClientAuthModule } from './features/auth/auth.client.module';
import { PatientModule } from './features/patient/patient.client.module';
import { AddressModule } from './modules/address/address.client.module';
import { ClientUserModule } from './features/users/users.client.module';

// TODO: merge!!
@Module({
  imports: [ClientUserModule, ClientAuthModule, PatientModule, AddressModule],
})
export class ClientModule { }
