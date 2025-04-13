import { BadRequestException, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { JWTAuthModule } from '@lib/shared/modules/jwt-auth/jwt-auth.module';
import { JWTAuthHelper } from '@lib/shared/modules/jwt-auth/jwt-auth.helper';
import { ExceptionErrorType } from '@lib/shared/types';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CLIENT_CONNECTION } from './database.constant';
import { TClientJwtPayload } from 'src/apps/client/features/auth/types';
import { getTenantConnection } from './connection.client';

const clientConnectionFactory = {
  scope: Scope.REQUEST,
  provide: CLIENT_CONNECTION,
  useFactory: async (request: Request, jwtAuthHelper: JWTAuthHelper<TClientJwtPayload>, config: ConfigService,) => {
    const schemaName = request.headers['x-tenant-id'] as string | undefined;
    const authorization = request.headers['authorization'] as string | undefined

    if (authorization) {
      const token = authorization.split(" ")?.[1]
      const secret = config.getOrThrow<string>('JWT_AUTH_SECRET');
      const payload = jwtAuthHelper.verifyToken({ token, secret: secret! })
      return getTenantConnection(payload.tenantId);
    } else if (schemaName) {
      return getTenantConnection(schemaName);
    } else {
      throw new BadRequestException({
        error_code: ExceptionErrorType.TenantIsRequired,
        message: "Tenant ID must be provided",
      });
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
