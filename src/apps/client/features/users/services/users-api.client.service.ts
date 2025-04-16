import { ClientUserEntity, ForeignKeyConflictException, UserExistsException } from '@lib/shared';
import { Inject, Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { ClientUserMapper, TClientUserMapperResponse } from '../users.client.mapper';
import { CLIENT_CONNECTION } from '@lib/shared/modules';
import { TBaseMapperFormat } from '@lib/shared/base';
import { DataSource, Repository } from 'typeorm';
import { DBErrorCode } from '@lib/shared/types';
import { ClientCreateUserDto } from '../dtos';
import { ClientUsersService } from './users.client.service';

// TODO : use ClientUserMapper in ClientUserEntity
@Injectable({ scope: Scope.REQUEST })
export class ClientUsersApiService {
  private readonly clientUsersRepository: Repository<ClientUserEntity>;

  constructor(
    @Inject(CLIENT_CONNECTION) connection: DataSource,
    private readonly clientUsersService: ClientUsersService
  ) {
    this.clientUsersRepository = connection.getRepository(ClientUserEntity);
  }

  async getUsers(format: TBaseMapperFormat = "toDto"): Promise<TClientUserMapperResponse[]> {
    const clientUserMapper = new ClientUserMapper();
    const userEntities = await this.clientUsersRepository.find();
    return userEntities.map((entity) => clientUserMapper.transform(entity, format));
  }

  async getUserById(id: string, format: TBaseMapperFormat = "toDtoWithRelations"): Promise<TClientUserMapperResponse> {
    const userEntity = await this.clientUsersRepository.findOneByOrFail({ id });
    this.clientUsersService.checkUserStatus(userEntity) // check user status

    const clientUserMapper = new ClientUserMapper();
    return clientUserMapper.transform(userEntity, format);
  }

  async createUser(userDto: ClientCreateUserDto, format: TBaseMapperFormat = "toDto"): Promise<TClientUserMapperResponse> {
    const clientUserMapper = new ClientUserMapper();

    try {
      let userEntity = await clientUserMapper.toCreateEntity(userDto);
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
}