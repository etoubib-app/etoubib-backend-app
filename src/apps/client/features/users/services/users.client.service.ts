import { ClientUserEntity, ForeignKeyConflictException, UserExistsException } from '@lib/shared';
import { Inject, Injectable, InternalServerErrorException, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CLIENT_CONNECTION } from '../../../constants/app.constant';
import { ClientCreateUserDto } from '../dtos';
import { ClientUserMapper, TClientUserMapperResponse } from '../users.client.mapper';
import { DBErrorCode, ExceptionErrorType } from '@lib/shared/types';
import { ClientUserStatus } from '@lib/shared/enums/client';
import { TBaseMapperFormat } from '@lib/shared/base';

@Injectable({ scope: Scope.REQUEST })
export class ClientUserService {
  private readonly clientUsersRepository: Repository<ClientUserEntity>;

  constructor(@Inject(CLIENT_CONNECTION) connection: DataSource) {
    this.clientUsersRepository = connection.getRepository(ClientUserEntity);
  }

  // TODO : add pagination
  async getUsers(format: TBaseMapperFormat = "toDto"): Promise<TClientUserMapperResponse[]> {
    const clientUserMapper = new ClientUserMapper()
    const userEntities = await this.clientUsersRepository.find();
    const userDtos = userEntities.map((entity) => clientUserMapper.transform(entity, format));
    return userDtos
  }

  async getUserById(id: string, format: TBaseMapperFormat = "toDtoWithRelations"): Promise<TClientUserMapperResponse> {
    const userEntity = await this.clientUsersRepository.findOneBy({ id });
    if (!userEntity) {
      throw new NotFoundException();
    }

    const clientUserMapper = new ClientUserMapper()
    return clientUserMapper.transform(userEntity, format);
  }

  async createUser(userDto: ClientCreateUserDto, format: TBaseMapperFormat = "toDto"): Promise<TClientUserMapperResponse> {
    try {
      const clientUserMapper = new ClientUserMapper()
      let userEntity = await clientUserMapper.toCreateEntity(userDto);

      // persist to db
      userEntity = await this.clientUsersRepository.save(userEntity);

      return clientUserMapper.transform(userEntity, format);
    } catch (error) {
      if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new UserExistsException(userDto.email);
      }
      if (
        error.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        error.code == DBErrorCode.PgNotNullConstraintViolation
      ) {
        throw new ForeignKeyConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  checkUserStatus(user: ClientUserEntity): boolean {
    if (user.status == ClientUserStatus.inactive) {
      throw new UnauthorizedException({
        error_code: ExceptionErrorType.InactiveUser,
        message: 'User not authorized to login',
      })
    }
    if (user.status == ClientUserStatus.blocked) {
      throw new UnauthorizedException({
        error_code: ExceptionErrorType.BlockedUser,
        message: 'User not authorized to login',
      })
    }
    return true
  }
}
