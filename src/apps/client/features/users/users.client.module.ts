import { ClientDatabaseModule } from '@lib/shared/modules';
import { forwardRef, Module } from '@nestjs/common';

import { ClientAuthModule } from '../auth/auth.client.module';
import { ClientUsersApiService, ClientUsersService } from './services';
import { ClientUserController } from './users.client.controller';

@Module({
  imports: [ClientDatabaseModule, forwardRef(() => ClientAuthModule)],
  controllers: [ClientUserController],
  providers: [ClientUsersApiService, ClientUsersService],
  exports: [ClientUsersService],
})
export class ClientUserModule {}
