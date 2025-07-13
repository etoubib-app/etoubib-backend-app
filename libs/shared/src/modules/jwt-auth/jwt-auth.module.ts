import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ClientJwtAuthGuard } from './guards/jwt-auth.client.guard';
import { JWTAuthService } from './services/jwt-auth.service';
import { ClientJwtStrategy } from './strategies/jwt.client.strategy';

@Module({
  imports: [
    JwtModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ClientJwtAuthGuard, ClientJwtStrategy, JWTAuthService],
  exports: [ClientJwtAuthGuard, JWTAuthService, ConfigModule]  // TODO: without exporting ConfigModule guard fails to work
})
export class JWTAuthModule { }
