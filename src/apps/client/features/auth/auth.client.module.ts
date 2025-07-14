import { AuthModule } from '@lib/shared/modules/auth/auth.module';
import { JWTAuthModule } from '@lib/shared/modules/jwt-auth';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.client.controller';

@Module({
  imports: [JWTAuthModule, AuthModule],
  controllers: [AuthController],
})
export class ClientAuthModule { }
