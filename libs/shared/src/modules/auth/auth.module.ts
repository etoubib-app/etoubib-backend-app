import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RepositoriesModule } from '../database';
import { JWTAuthModule } from '../jwt-auth';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule, JWTAuthModule, RepositoriesModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
