import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientUserEntity, InvalidTokenException } from '@lib/shared';
import { TClientJwtPayload } from '../types';
import { getTenantEntityManager } from 'src/apps/client/modules/database/connection';
import { ClientUserStatus } from '@lib/shared/enums/client';
import { ExceptionErrorType } from '@lib/shared/types';
import { ClientUserMapper } from '../../users/users.client.mapper';
import { ClientUserWithRelationsResponseDto } from '../../users/dtos';

@Injectable()
export class ClientJwtStrategy extends PassportStrategy(Strategy) {
    constructor(protected readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('JWT_AUTH_SECRET')!,
            ignoreExpiration: false,
        });
    }

    async validate({ userId, tenantId }: TClientJwtPayload): Promise<ClientUserWithRelationsResponseDto> {
        const entityManager = await getTenantEntityManager(tenantId);  // TODO: use DI instead
        const user = await entityManager.getRepository(ClientUserEntity).findOneBy({ id: userId });
        if (!user) throw new InvalidTokenException()

        // TODO: check if payload.loggedAt match with user.loggedAt

        if (user.status == ClientUserStatus.inactive) {
            throw new UnauthorizedException({
                error_code: ExceptionErrorType.InactiveUser,
                message: 'User not authorized',
            })
        }
        if (user.status == ClientUserStatus.blocked) {
            throw new UnauthorizedException({
                error_code: ExceptionErrorType.BlockedUser,
                message: 'User not authorized',
            })
        }

        const clientUserMapper = new ClientUserMapper()
        return clientUserMapper.toDtoWithRelations(user)
    }
}
