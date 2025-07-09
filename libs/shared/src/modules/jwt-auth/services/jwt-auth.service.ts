import { InvalidTokenException } from '@lib/shared/exceptions';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../../auth';

@Injectable()
export class JWTAuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken({
    payload,
    secret,
    expiresIn,
  }: {
    payload: JwtPayload;
    secret: string;
    expiresIn: string;
  }): string {
    const token = this.jwtService.sign(payload, { secret, expiresIn });
    return token;
  }

  verifyToken({ token, secret }: Record<'token' | 'secret', string>) {
    try {
      return this.jwtService.verify<JwtPayload>(token, { secret });
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new InvalidTokenException();
    }
  }
}
