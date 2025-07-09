import { BaseMapper } from '../base';
import {
  ClientCreateUserDto,
  ClientUserResponseDto,
  ClientUserWithRelationsResponseDto,
} from '../dto';
import { ClientUser } from '../entities/client';
import { ClientUserStatus } from '../enums/client';

export type TClientUserMapperResponse = ReturnType<
  InstanceType<typeof ClientUserMapper>['transform']
>;
type TClientUserMapperDtos = Exclude<TClientUserMapperResponse, ClientUser>;

export class ClientUserMapper extends BaseMapper<
  ClientUser,
  ClientUserResponseDto,
  ClientUserWithRelationsResponseDto
> {
  protected fillBasicDtoFields(dto: TClientUserMapperDtos, entity: ClientUser) {
    this.fillDefaultFields(dto, entity);
    dto.email = entity.email;
    dto.lastName = entity.lastName;
    dto.firstName = entity.firstName;
    dto.status = entity.status;
    // TODO : add role field

    return dto;
  }

  public toDto(entity: ClientUser): ClientUserResponseDto {
    const dto = this.fillBasicDtoFields(new ClientUserResponseDto(), entity);
    return dto;
  }

  public toDtoWithRelations(
    entity: ClientUser,
  ): ClientUserWithRelationsResponseDto {
    const dto = this.fillBasicDtoFields(
      new ClientUserWithRelationsResponseDto(),
      entity,
    ) as ClientUserWithRelationsResponseDto;
    // TODO : add extra relationships ( eg: permissions ... )
    dto.extra_field_example = 'extra_field';

    return dto;
  }

  public async toCreateEntity(dto: ClientCreateUserDto): Promise<ClientUser> {
    const entity = new ClientUser();
    entity.email = dto.email;
    entity.lastName = dto.lastName;
    entity.firstName = dto.firstName;
    entity.status = ClientUserStatus.active;
    await entity.setPassword(dto.password); // encrypt password
    return entity;
  }
}
