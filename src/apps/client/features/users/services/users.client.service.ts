import { ClientUserEntity } from '@lib/shared';
import { ClientUserStatus } from '@lib/shared/enums/client';
import { ExceptionErrorType } from '@lib/shared/types';
import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ClientUsersService {
  private readonly clientUsersRepository: Repository<ClientUserEntity>;

  constructor(private readonly connection: DataSource) {
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
