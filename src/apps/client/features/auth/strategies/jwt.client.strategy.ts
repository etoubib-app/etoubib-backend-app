import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ClientUserEntity, InvalidTokenException } from '@lib/shared';
import { TClientJwtPayload } from '../types';
import { ClientUserMapper } from '../../users/users.client.mapper';
import { ClientUserWithRelationsResponseDto } from '../../users/dtos';
import { getTenantConnection } from '@lib/shared/modules';
import { ClientUsersService } from '../../users/services';

@Injectable()
export class ClientJwtStrategy extends PassportStrategy(Strategy) {
    constructor(protected readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('jwt.client.secret')!,
            ignoreExpiration: false,
        });
    }

    async validate({ userId, tenantId }: TClientJwtPayload): Promise<ClientUserWithRelationsResponseDto> {
        const tenantConnection = await getTenantConnection(tenantId);
        const user = await tenantConnection.getRepository(ClientUserEntity).findOneBy({ id: userId });
        if (!user) throw new InvalidTokenException()

        // TODO: use DI
        const clientUserService = new ClientUsersService(tenantConnection)
        clientUserService.checkUserStatus(user)

        const clientUserMapper = new ClientUserMapper()
        return clientUserMapper.toDtoWithRelations(user)
    }
}
