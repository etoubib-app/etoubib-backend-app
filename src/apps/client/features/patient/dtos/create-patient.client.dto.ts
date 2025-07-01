
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
import { CreateAddressDto } from './create-address.client.dto';

// TODO: add swagger placeholders 
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
  phoneNumber: string;

  @IsDateString()
  birthDate: string;

  @IsString()
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
  address?: CreateAddressDto;

  @ValidateIf(o => !o.address)
  @IsUUID()
  @IsOptional()
  address_id?: string;
}