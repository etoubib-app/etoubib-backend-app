import { forwardRef, Module } from '@nestjs/common';

import { ClientUserController } from './users.client.controller';
import { ClientUserService } from './services/users.client.service';
import { ClientAuthModule } from '../auth/auth.client.module';
import { ClientDatabaseModule } from '@lib/shared/modules';

@Module({
  imports: [ClientDatabaseModule, forwardRef(() => ClientAuthModule)],
  controllers: [ClientUserController],
  providers: [ClientUserService],
  exports: [ClientUserService]
})
export class ClientUserModule { }
