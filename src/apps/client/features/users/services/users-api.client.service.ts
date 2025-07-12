import { type TBaseMapperFormat } from '@lib/shared/base';
import { ClientCreateUserDto } from '@lib/shared/dto';
import { ClientUser } from '@lib/shared/entities';
import {
  ForeignKeyConflictException,
  UserExistsException,
} from '@lib/shared/exceptions';
import {
  ClientUserMapper,
  type TClientUserMapperResponse,
} from '@lib/shared/mappers';
import { CLIENT_CONNECTION } from '@lib/shared/modules';
import { DBErrorCode } from '@lib/shared/types';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ClientUsersService } from './users.client.service';

// TODO : use ClientUserMapper in ClientUserEntity
@Injectable({ scope: Scope.REQUEST })
export class ClientUsersApiService {
  private readonly clientUsersRepository: Repository<ClientUser>;

  constructor(
    @Inject(CLIENT_CONNECTION) connection: DataSource,
    private readonly clientUsersService: ClientUsersService,
  ) {
    this.clientUsersRepository = connection.getRepository(ClientUser);
  }

  async getUsers(
    format: TBaseMapperFormat = 'toDto',
  ): Promise<TClientUserMapperResponse[]> {
    const clientUserMapper = new ClientUserMapper();
    const userEntities = await this.clientUsersRepository.find();
    return userEntities.map((entity) =>
      clientUserMapper.transform(entity, format),
    );
  }

  async getUserById(
    id: string,
    format: TBaseMapperFormat = 'toDtoWithRelations',
  ): Promise<TClientUserMapperResponse> {
    const userEntity = await this.clientUsersRepository.findOneByOrFail({ id });
    userEntity.checkUserStatus();

    const clientUserMapper = new ClientUserMapper();
    return clientUserMapper.transform(userEntity, format);
  }

  async createUser(
    userDto: ClientCreateUserDto,
    format: TBaseMapperFormat = 'toDto',
  ): Promise<TClientUserMapperResponse> {
    const clientUserMapper = new ClientUserMapper();

    try {
      let userEntity = await clientUserMapper.toCreateEntity(userDto);
      userEntity = await this.clientUsersRepository.save(userEntity);
      return clientUserMapper.transform(userEntity, format);
    } catch (error) {
      const { code } = error as { code: unknown };
      if (code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new UserExistsException(userDto.email);
      }
      if (
        code == DBErrorCode.PgForeignKeyConstraintViolation ||
        code == DBErrorCode.PgNotNullConstraintViolation
      ) {
        throw new ForeignKeyConflictException();
      }
      throw new InternalServerErrorException();
    }
  }
}
