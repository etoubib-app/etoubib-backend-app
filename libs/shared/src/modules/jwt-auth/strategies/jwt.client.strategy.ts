import { User, InvalidTokenException } from '@lib/shared';
import { UserResponseDto } from '@lib/shared/dto';
import { getTenantConnection, JwtPayload } from '@lib/shared/modules';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('jwt.client.secret'),
      ignoreExpiration: false,
    });
  }

  async validate({ userId, tenantId }: JwtPayload): Promise<UserResponseDto> {
    const tenantConnection = await getTenantConnection(tenantId);
    const user = await tenantConnection
      .getRepository(User)
      .findOneBy({ id: userId });

    if (!user) throw new InvalidTokenException();
    user.checkUserStatus();

    return user;
  }
}
