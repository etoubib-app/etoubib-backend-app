import { Module } from '@nestjs/common';

import { ClientUsersModule } from './features/users/users.client.module';

@Module({
  imports: [ClientUsersModule],
})
export class ClientModule {}
