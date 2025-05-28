import { BaseResponseDto } from '@lib/shared/base';
import { TClientUserStatus } from '@lib/shared/enums/client';
import { ApiProperty } from '@nestjs/swagger';

export class ClientUserResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName?: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'johnDoe@gmail.com' })
  email: string;

  @ApiProperty({ example: 'active' })
  status: TClientUserStatus;

  @ApiProperty()
  isOwner: boolean;
}
