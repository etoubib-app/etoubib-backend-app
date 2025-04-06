import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from '../../modules/database/database.module';
import { ClientUserController } from './users.client.controller';
import { ClientUserService } from './services/users.client.service';
import { ClientAuthModule } from '../auth/auth.client.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => ClientAuthModule)],
  controllers: [ClientUserController],
  providers: [ClientUserService],
  exports: [ClientUserService]
})
export class ClientUserModule { }
