import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TBoAuthUser } from 'src/apps/backoffice/features/auth/types';
import { TClientAuthUser } from 'src/apps/client/features/auth/types';

type TAuthUser = TClientAuthUser & TBoAuthUser
export const GetAuthUser = createParamDecorator(
    (data: keyof TAuthUser | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user as TAuthUser;

        if (!user) return null;
        return data ? user?.[data] : user;
    },
);