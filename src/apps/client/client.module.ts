import { Module } from '@nestjs/common';

import { ClientAuthModule } from './features/auth/auth.client.module';
import { ClientUserModule } from './features/users/users.client.module';

@Module({
  imports: [ClientUserModule, ClientAuthModule],
})
export class ClientModule {}
