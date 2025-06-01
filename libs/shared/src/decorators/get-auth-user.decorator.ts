import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { TAuthUser } from '../modules';

export const GetAuthUser = createParamDecorator(
  (data: keyof TAuthUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user: TAuthUser }>();
    const user = request.user;

    if (!user) return null;
    return data ? user?.[data] : user;
  },
);
