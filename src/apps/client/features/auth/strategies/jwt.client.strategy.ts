import { ClientUserEntity, InvalidTokenException } from '@lib/shared';
import { getTenantConnection } from '@lib/shared/modules';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ClientUserWithRelationsResponseDto } from '../../users/dtos';
import { ClientUsersService } from '../../users/services';
import { ClientUserMapper } from '../../users/users.client.mapper';
import { TClientJwtPayload } from '../types';

@Injectable()
export class ClientJwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('jwt.client.secret'),
      ignoreExpiration: false,
    });
  }

  async validate({
    userId,
    tenantId,
  }: TClientJwtPayload): Promise<ClientUserWithRelationsResponseDto> {
    const tenantConnection = await getTenantConnection(tenantId);
    const user = await tenantConnection
      .getRepository(ClientUserEntity)
      .findOneBy({ id: userId });
    if (!user) throw new InvalidTokenException();

    // TODO: use DI
    const clientUsersService = new ClientUsersService(tenantConnection);
    clientUsersService.checkUserStatus(user);

    const clientUserMapper = new ClientUserMapper();
    return clientUserMapper.toDtoWithRelations(user);
  }
}
