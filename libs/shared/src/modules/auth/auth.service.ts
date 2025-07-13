import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import {
  BoUserLoginResponseDto,
  ClientUserLoginResponseDto,
  UserLoginDto,
} from '../../dto';
import { BoUserEntity } from '../../entities/backoffice';
import { ClientUser } from '../../entities/client';
import { InvalidCredentialsException } from '../../exceptions';
import { BoUserMapper } from '../../mappers/users.bo.mapper';
import { ClientUserMapper } from '../../mappers/users.client.mapper';
import { getTenantConnection } from '../database/connection.client';
import { USER_REPOSITORY_TOKEN } from '../database/repository-provider/user-repository.provider';
import { JWTAuthService } from '../jwt-auth';
import { JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: Repository<BoUserEntity>,
    private readonly jwtAuthService: JWTAuthService,
  ) { }

  async clientLogin(
    { email, password, remember_me }: UserLoginDto,
    tenantId: string,
  ): Promise<ClientUserLoginResponseDto> {
    if (!tenantId) {
      throw new Error('Tenant ID must be provided');
    }
    const tenantConnexion = await getTenantConnection(tenantId);
    const userRepository = tenantConnexion.getRepository(ClientUser);
    const user = await userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new InvalidCredentialsException();
    }
    await this.validateUserWithPassword(user, password);

    const payload: JwtPayload = { userId: user.id, tenantId };

    const token = this.generateAccessToken(payload, !!remember_me);

    const clientUserMapper = new ClientUserMapper();
    const userDto = clientUserMapper.toDtoWithRelations(user);
    return { user: userDto, tokens: { accessToken: token } };
  }

  async boLogin({
    email,
    password,
    remember_me,
  }: UserLoginDto): Promise<BoUserLoginResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new InvalidCredentialsException();
    }
    await this.validateUserWithPassword(user, password);

    const payload: JwtPayload = {
      userId: user.id,
      tenantId: 'backoffice',
      is_bo_user: true,
    };
    const token = this.generateAccessToken(payload, !!remember_me);

    const userMapper = new BoUserMapper();
    const userDto = userMapper.toDtoWithRelations(user);
    return { user: userDto, tokens: { accessToken: token } };
  }

  private generateAccessToken(payload: JwtPayload, remember_me: boolean) {
    const secret = this.configService.getOrThrow<string>('jwt.client.secret');
    const expiresIn = remember_me
      ? this.configService.getOrThrow<string>('jwt.client.remember_expires_in')
      : this.configService.getOrThrow<string>('jwt.client.expires_in');

    return this.jwtAuthService.generateAccessToken({
      payload,
      secret,
      expiresIn,
    });
  }

  private async validateUserWithPassword(
    user: ClientUser | BoUserEntity,
    password: string,
  ) {
    const passwordMatched = await user.checkPassword(password);
    if (!passwordMatched) throw new InvalidCredentialsException();
    user.checkUserStatus();
  }
}
