import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JWTAuthHelper } from './jwt-auth.helper';

@Module({
  imports: [JwtModule],
  providers: [JWTAuthHelper],
  exports: [JWTAuthHelper],
})
export class JWTAuthModule {}
