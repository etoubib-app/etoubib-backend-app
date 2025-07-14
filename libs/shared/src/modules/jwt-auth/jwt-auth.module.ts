import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthGuard } from './guards/jwt-auth.client.guard';
import { JWTAuthService } from './services/jwt-auth.service';
import { JwtStrategy } from './strategies/jwt.client.strategy';

@Module({
  imports: [
    JwtModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtAuthGuard, JwtStrategy, JWTAuthService],
  exports: [JwtAuthGuard, JWTAuthService, ConfigModule]  // TODO: without exporting ConfigModule guard fails to work
})
export class JWTAuthModule { }
