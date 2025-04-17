import { ApiProperty } from '@nestjs/swagger';
import { ClientUserResponseDto } from './user-response.client.dto';

export class ClientUserWithRelationsResponseDto extends ClientUserResponseDto {
  @ApiProperty()
  extra_field_example: string;
}
