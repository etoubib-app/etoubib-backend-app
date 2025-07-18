import { BaseResponseDto } from '@lib/shared/base';
import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto extends BaseResponseDto {
  @ApiProperty({ example: '123 Main Street' })
  address!: string;

  @ApiProperty({ example: '20250' })
  postalCode?: string;

  @ApiProperty({ example: 'Casablanca' })
  city?: string;

  @ApiProperty({ example: 'Morocco' })
  country?: string;
}
