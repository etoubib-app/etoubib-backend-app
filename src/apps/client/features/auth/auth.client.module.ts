import { ClientDatabaseModule, JWTAuthModule } from '@lib/shared/modules';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { ClientUserModule } from '../users/users.client.module';
import { ClientAuthController } from './auth.client.controller';
import { ClientAuthService } from './services/auth.client.service';
import { ClientJwtStrategy } from './strategies/jwt.client.strategy';

@Module({
  imports: [
    ConfigModule,
    ClientDatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JWTAuthModule,
    forwardRef(() => ClientUserModule),
  ],
  controllers: [ClientAuthController],
  providers: [ClientJwtStrategy, ClientAuthService],
  exports: [ClientJwtStrategy, JWTAuthModule, ConfigModule],
})
export class ClientAuthModule {}
