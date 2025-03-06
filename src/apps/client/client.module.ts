import { Module } from '@nestjs/common';

import { ClientUsersModule } from './modules/users/users.client.module';

@Module({
  imports: [ClientUsersModule],
})
export class ClientModule {}
