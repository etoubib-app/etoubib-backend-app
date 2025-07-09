import { BaseMapper } from '../base';
import {
  BoCreateUserDto,
  BoUserResponseDto,
  BoUserWithRelationsResponseDto,
} from '../dto';
import { BoUserEntity } from '../entities/backoffice';
import { ClientUserStatus } from '../enums/client';

export type TBoUserMapperResponse = ReturnType<
  InstanceType<typeof BoUserMapper>['transform']
>;
type TBoUserMapperDtos = Exclude<TBoUserMapperResponse, BoUserEntity>;

export class BoUserMapper extends BaseMapper<
  BoUserEntity,
  BoUserResponseDto,
  BoUserWithRelationsResponseDto
> {
  protected fillBasicDtoFields(dto: TBoUserMapperDtos, entity: BoUserEntity) {
    this.fillDefaultFields(dto, entity);
    dto.email = entity.email;
    dto.lastName = entity.lastName;
    dto.firstName = entity.firstName;
    dto.status = entity.status;
    // TODO : add role field

    return dto;
  }

  public toDto(entity: BoUserEntity): BoUserResponseDto {
    const dto = this.fillBasicDtoFields(new BoUserResponseDto(), entity);
    return dto;
  }

  public toDtoWithRelations(
    entity: BoUserEntity,
  ): BoUserWithRelationsResponseDto {
    const dto = this.fillBasicDtoFields(
      new BoUserWithRelationsResponseDto(),
      entity,
    ) as BoUserWithRelationsResponseDto;
    // TODO : add extra relationships ( eg: permissions ... )
    dto.extra_field_example = 'extra_field';

    return dto;
  }

  public async toCreateEntity(dto: BoCreateUserDto): Promise<BoUserEntity> {
    const entity = new BoUserEntity();
    entity.email = dto.email;
    entity.lastName = dto.lastName;
    entity.firstName = dto.firstName;
    entity.status = ClientUserStatus.active;
    await entity.setPassword(dto.password); // encrypt password
    return entity;
  }
}
