import { ClientUserResponseDto, ClientCreateUserDto } from './dtos';
import { ClientUserStatus } from '@lib/shared/enums/client';
import { ClientUserEntity } from '@lib/shared';
import { BaseMapper } from '@lib/shared/base';
import { ClientUserWithRelationsResponseDto } from './dtos/user-with-relations-response.client.dto';

export type TClientUserMapperResponse = ReturnType<
  InstanceType<typeof ClientUserMapper>['transform']
>;
type TClientUserMapperDtos = Exclude<
  TClientUserMapperResponse,
  ClientUserEntity
>;

export class ClientUserMapper extends BaseMapper<
  ClientUserEntity,
  ClientUserResponseDto,
  ClientUserWithRelationsResponseDto
> {
  protected fillBasicDtoFields(
    dto: TClientUserMapperDtos,
    entity: ClientUserEntity,
  ) {
    this.fillDefaultFields(dto, entity);
    dto.email = entity.email;
    dto.lastName = entity.lastName;
    dto.firstName = entity.firstName;
    dto.fullName = entity.lastName
      ? `${entity.firstName} ${entity.lastName}`
      : dto.firstName;
    dto.isOwner = entity.isOwner;
    dto.status = entity.status;
    // TODO : add role field

    return dto;
  }

  public toDto(entity: ClientUserEntity): ClientUserResponseDto {
    const dto = this.fillBasicDtoFields(new ClientUserResponseDto(), entity);
    return dto;
  }

  public toDtoWithRelations(
    entity: ClientUserEntity,
  ): ClientUserWithRelationsResponseDto {
    let dto = this.fillBasicDtoFields(
      new ClientUserWithRelationsResponseDto(),
      entity,
    ) as ClientUserWithRelationsResponseDto;
    // TODO : add extra relationships ( eg: permissions ... )
    dto.extra_field_example = 'extra_field';

    return dto;
  }

  public async toCreateEntity(
    dto: ClientCreateUserDto,
  ): Promise<ClientUserEntity> {
    const entity = new ClientUserEntity();
    entity.email = dto.email;
    entity.lastName = dto.lastName;
    entity.firstName = dto.firstName;
    entity.isOwner = dto.isOwner || false;
    entity.status = ClientUserStatus.active;
    await entity.setPassword(dto.password); // encrypt password
    return entity;
  }
}
