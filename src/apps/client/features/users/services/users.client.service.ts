import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { ClientUserEntity, } from '@lib/shared';
import { ExceptionErrorType } from '@lib/shared/types';
import { ClientUserStatus } from '@lib/shared/enums/client';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ClientUsersService {
    protected readonly clientUsersRepository: Repository<ClientUserEntity>;

    constructor(protected readonly connection: DataSource) {
        this.clientUsersRepository = connection.getRepository(ClientUserEntity);
    }

    checkUserStatus(user: ClientUserEntity): boolean {
        if (user.status == ClientUserStatus.inactive) {
            throw new UnauthorizedException({
                error_code: ExceptionErrorType.InactiveUser,
                message: 'User not authorized to login',
            });
        }
        if (user.status == ClientUserStatus.blocked) {
            throw new UnauthorizedException({
                error_code: ExceptionErrorType.BlockedUser,
                message: 'User not authorized to login',
            });
        }
        return true;
    }
}