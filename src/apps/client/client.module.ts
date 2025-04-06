import { Module } from '@nestjs/common';

import { ClientUserModule } from './features/users/users.client.module';
import { ClientAuthModule } from './features/auth/auth.client.module';

@Module({
  imports: [ClientUserModule, ClientAuthModule],
})
export class ClientModule { }
