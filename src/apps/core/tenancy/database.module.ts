import { ForbiddenException, Module, Scope } from '@nestjs/common';
import { getTenantConnection } from './connection';
import { REQUEST } from '@nestjs/core';
import { CONNECTION } from '../constants/app.constant';

const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory: async (request: Request) => {
    const schema_name = request.headers['x-tenant-id'] as string | undefined;
    if (!schema_name) {
      throw new ForbiddenException('Tenant ID is required');
    }
    return getTenantConnection(schema_name);
  },

  inject: [REQUEST],
};

@Module({
  imports: [],
  providers: [connectionFactory],
  exports: [CONNECTION],
})
export class DatabaseModule {}
