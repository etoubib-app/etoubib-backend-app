import { Module } from '@nestjs/common';
import { ClientAuthModule } from '../auth/auth.client.module';
import { ClientUserController } from './users.client.controller';
import { ClientUsersApiService, ClientUsersService } from './services';
import { ClientDatabaseModule } from '@lib/shared/modules';

@Module({
  imports: [ClientDatabaseModule, ClientAuthModule],
  controllers: [ClientUserController],
  providers: [ClientUsersApiService, ClientUsersService],
  exports: []
})
export class ClientUserModule { }
