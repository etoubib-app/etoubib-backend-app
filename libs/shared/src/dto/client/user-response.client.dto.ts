import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '../../base';
import { TClientUserStatus } from '../../enums/client';

export class ClientUserResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'John' })
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  lastName!: string;

  @ApiProperty({ example: 'johnDoe@gmail.com' })
  email!: string;

  @ApiProperty({ example: 'active' })
  status!: TClientUserStatus;

  @ApiProperty({ example: false })
  isOwner?: boolean;
}

export class ClientUserWithRelationsResponseDto extends ClientUserResponseDto {
  @ApiProperty()
  extra_field_example!: string;
}
