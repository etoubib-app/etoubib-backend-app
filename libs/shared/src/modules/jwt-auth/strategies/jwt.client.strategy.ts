import { ClientUser, InvalidTokenException } from '@lib/shared';
import { ClientUserWithRelationsResponseDto } from '@lib/shared/dto';
import { ClientUserMapper } from '@lib/shared/mappers';
import { getTenantConnection, JwtPayload } from '@lib/shared/modules';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
  }: JwtPayload): Promise<ClientUserWithRelationsResponseDto> {
    const tenantConnection = await getTenantConnection(tenantId);
    const user = await tenantConnection
      .getRepository(ClientUser)
      .findOneBy({ id: userId });
    if (!user) throw new InvalidTokenException();

    user.checkUserStatus();

    const clientUserMapper = new ClientUserMapper();
    return clientUserMapper.toDtoWithRelations(user);
  }
}
