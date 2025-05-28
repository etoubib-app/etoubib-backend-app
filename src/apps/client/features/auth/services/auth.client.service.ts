import { ClientUserEntity, InvalidCredentialsException } from '@lib/shared';
import { CLIENT_CONNECTION, JWTAuthHelper } from '@lib/shared/modules';
import { ExceptionErrorType } from '@lib/shared/types';
import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { DataSource, Repository } from 'typeorm';

import { ClientUsersService } from '../../users/services';
import { ClientUserMapper } from '../../users/users.client.mapper';
import { ClientUserLoginDto, ClientUserLoginResponseDto } from '../dtos';
import { TClientJwtPayload } from '../types';

@Injectable({ scope: Scope.REQUEST })
export class ClientAuthService {
  private readonly clientUserRepository: Repository<ClientUserEntity>;

  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly configService: ConfigService,
    private clientUsersService: ClientUsersService,
    @Inject(CLIENT_CONNECTION) connection: DataSource,
    private readonly jwtAuthHelper: JWTAuthHelper<TClientJwtPayload>,
  ) {
    this.clientUserRepository = connection.getRepository(ClientUserEntity);
  }

  async login({
    email,
    password,
    remember_me,
  }: ClientUserLoginDto): Promise<ClientUserLoginResponseDto> {
    const tenantId = this.request.headers['x-tenant-id'];
    if (!tenantId)
      throw new UnauthorizedException({
        error_code: ExceptionErrorType.TenantIsRequired,
        message: 'Tenant ID must be provided',
      });

    const user = await this.clientUserRepository.findOneBy({ email });
    if (!user) throw new InvalidCredentialsException();

    const passwordMatched = await user.checkPassword(password);
    if (!passwordMatched) throw new InvalidCredentialsException();

    // check user status
    this.clientUsersService.checkUserStatus(user);

    // generate token
    const secret = this.configService.getOrThrow<string>('jwt.client.secret');
    const expiresIn = remember_me
      ? this.configService.getOrThrow<string>('jwt.client.remember_expires_in')
      : this.configService.getOrThrow<string>('jwt.client.expires_in');
    const payload: TClientJwtPayload = { userId: user.id, tenantId };
    const token = this.jwtAuthHelper.generateAccessToken({
      payload,
      secret: secret,
      expiresIn: expiresIn,
    });

    const clientUserMapper = new ClientUserMapper();
    const userDto = clientUserMapper.toDtoWithRelations(user);
    return { user: userDto, tokens: { accessToken: token } };
  }
}
