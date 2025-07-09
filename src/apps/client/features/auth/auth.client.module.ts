import { AuthModule } from '@lib/shared/modules/auth/auth.module';
import { JWTAuthModule } from '@lib/shared/modules/jwt-auth';
import { Module } from '@nestjs/common';

import { ClientAuthController } from './auth.client.controller';

@Module({
  imports: [JWTAuthModule, AuthModule],
  controllers: [ClientAuthController],
})
export class ClientAuthModule {}
