import { Module } from '@nestjs/common';
import { ClientDatabaseModule } from '@lib/shared/modules';
import { ClientAuthModule } from '../../features/auth/auth.client.module';

@Module({
  imports: [ClientDatabaseModule, ClientAuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AddressModule { }
