import { Module, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { CLIENT_CONNECTION } from './database.constant';
import { getTenantConnection } from './connection.client';
import { TClientJwtPayload } from 'src/apps/client/features/auth/types';
import { JWTAuthHelper } from '../jwt-auth/jwt-auth.helper';
import { JWTAuthModule } from '../jwt-auth/jwt-auth.module';

const clientConnectionFactory = {
  scope: Scope.REQUEST,
  provide: CLIENT_CONNECTION,
  useFactory: async (request: Request, jwtAuthHelper: JWTAuthHelper<TClientJwtPayload>, config: ConfigService,) => {
    const schemaName = request.headers['x-tenant-id'] as string | undefined;
    const authorization = request.headers['authorization'] as string | undefined

    if (authorization) {
      const token = authorization.split(" ")?.[1]
      const secret = config.getOrThrow<string>('jwt.client.secret');
      const payload = jwtAuthHelper.verifyToken({ token, secret: secret! })
      return await getTenantConnection(payload.tenantId);
    } else if (schemaName) {
      return await getTenantConnection(schemaName);
    } else {
      throw new UnauthorizedException();
    }
  },
  inject: [REQUEST, JWTAuthHelper, ConfigService],
};

@Module({
  imports: [JWTAuthModule, ConfigModule],
  providers: [clientConnectionFactory],
  exports: [CLIENT_CONNECTION],
})
export class ClientDatabaseModule { }
