import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const getTenantId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string | undefined => {
    const request = context.switchToHttp().getRequest<Request>();
    const tenantId = request.headers['x-tenant-id'] as string | undefined;
    if (!tenantId) {
      throw new Error('Tenant ID not found in request headers');
    }
    return tenantId;
  },
);
