import { ClientDatabaseModule } from '@lib/shared/modules';
import { JWTAuthModule } from '@lib/shared/modules/jwt-auth';
import { Module } from '@nestjs/common';

import { UserApiService, UserService } from './services';
import { UserController } from './users.client.controller';

@Module({
  imports: [ClientDatabaseModule, JWTAuthModule],
  controllers: [UserController],
  providers: [UserApiService, UserService],
  exports: [UserService],
})
export class UserModule { }
