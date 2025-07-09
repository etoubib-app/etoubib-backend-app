import { InvalidTokenException } from '@lib/shared/exceptions';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

import { JWTAuthService } from '../services/jwt-auth.service';

@Injectable()
export class ClientJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtAuthService: JWTAuthService,
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
    this.jwtAuthService.verifyToken({ token: accessToken, secret: secret });

    return super.canActivate(context);
  }

  handleRequest<T>(error: unknown, user: T | false): T {
    if (error || !user) throw new InvalidTokenException();
    return user;
  }
}
