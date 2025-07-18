import { Module } from '@nestjs/common';

import { PatientModule } from './features/patient/patient.client.module';
import { AddressModule } from './modules/address/address.client.module';
import { UserModule } from './features/users/users.client.module';
import { FormModule } from './features/form/form.client.module';
import { ClientAuthModule } from './features/auth/auth.client.module';

@Module({
  imports: [
    ClientAuthModule,
    UserModule,
    PatientModule,
    AddressModule,
    FormModule,
  ],
})
export class ClientModule {}
