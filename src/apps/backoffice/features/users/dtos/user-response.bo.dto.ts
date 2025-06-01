import { ApiProperty } from '@nestjs/swagger';

export class BoUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}
