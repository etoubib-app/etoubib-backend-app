import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RepositoriesModule } from '../database';
import { BoDatabaseModule } from '../database/database.bo.module';
import { JWTAuthModule } from '../jwt-auth';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule, BoDatabaseModule, RepositoriesModule, JWTAuthModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
