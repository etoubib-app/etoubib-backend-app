import { InvalidTokenException } from '@lib/shared/exceptions';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTAuthHelper<T extends object> {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken({
    payload,
    secret,
    expiresIn,
  }: {
    payload: T;
    secret: string;
    expiresIn: string;
  }): string {
    const token = this.jwtService.sign(payload, { secret, expiresIn });
    return token;
  }

  verifyToken({ token, secret }: Record<'token' | 'secret', string>) {
    try {
      return this.jwtService.verify<T>(token, { secret });
    } catch (error) {
      throw new InvalidTokenException();
    }
  }
}
