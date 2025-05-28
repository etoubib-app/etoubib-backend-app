import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { InvalidTokenException } from '@lib/shared/exceptions';
import { TClientJwtPayload } from '../types';
import { ConfigService } from '@nestjs/config';
import { JWTAuthHelper } from '@lib/shared/modules';

@Injectable()
export class ClientJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtAuthHelper: JWTAuthHelper<TClientJwtPayload>,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.switchToHttp().getRequest(),
    );
    if (!accessToken)
      throw new UnauthorizedException({ message: 'Token is not provided' });

    const secret = this.configService.getOrThrow<string>('jwt.client.secret');
    this.jwtAuthHelper.verifyToken({ token: accessToken, secret: secret! });

    return super.canActivate(context);
  }

  handleRequest<T>(error: unknown, user: T | false): T {
    if (error || !user) throw new InvalidTokenException();
    return user;
  }
}
