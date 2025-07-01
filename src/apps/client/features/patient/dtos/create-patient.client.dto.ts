
import {
  IsString,
  IsDateString,
  IsOptional,
  ValidateNested,
  ValidateIf,
  IsUUID,
  MaxLength,
  IsAlphanumeric,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { ExactlyOneAddressField } from '../validators';
import { CreateAddressDto } from '../../../modules/address/dtos';

@ExactlyOneAddressField({ message: 'Provide either address or address_id, not both' })
export class CreatePatientDto {
  @IsString()
  @MaxLength(100)
  @IsAlphanumeric()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsString()
  @MaxLength(100)
  @IsAlphanumeric()
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsString()
  @MaxLength(20)
  @ApiProperty({ example: '0000' })
  phoneNumber: string;

  @IsDateString()
  @ApiProperty({ example: '2000-12-21' })
  birthDate: string;

  @IsString()
  @ApiProperty({ example: 'CR12345' })
  cin: string;

  @IsOptional()
  @IsString()
  cnss?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsAlphanumeric()
  guardianFirstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsAlphanumeric()
  guardianLastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  guardianPhoneNumber?: string;

  // @IsOptional()
  // @IsUUID()
  // guardian_id?: string;

  @ValidateIf(o => !o.address_id)
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsOptional()
  @ApiProperty({
    type: () => CreateAddressDto, nullable: true, example: {
      address: '123 Main Street',
      postalCode: '20250',
      city: 'Casablanca',
      country: 'Morocco'
    }
  })
  address?: CreateAddressDto;

  @ValidateIf(o => !o.address)
  @IsUUID()
  @IsOptional()
  address_id?: string;
}