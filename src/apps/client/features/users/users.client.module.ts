import { ClientDatabaseModule } from '@lib/shared/modules';
import { JWTAuthModule } from '@lib/shared/modules/jwt-auth';
import { Module } from '@nestjs/common';

import { ClientUsersApiService, ClientUsersService } from './services';
import { ClientUserController } from './users.client.controller';

@Module({
  imports: [ClientDatabaseModule, JWTAuthModule],
  controllers: [ClientUserController],
  providers: [ClientUsersApiService, ClientUsersService],
  exports: [ClientUsersService],
})
export class ClientUserModule { }
