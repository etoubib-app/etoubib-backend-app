
import {
  IsString,
  IsDateString,
  IsOptional,
  IsUUID,
  MaxLength,
  IsAlphanumeric,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsAlphanumeric()
  @ApiProperty({ example: 'Jade' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsAlphanumeric()
  @ApiProperty({ example: 'Doe' })
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '00000' })
  cin?: string;

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

  @IsOptional()
  @IsUUID()
  @ApiProperty({ example: '9542089b-6e3f-41dd-b389-f7e110366dd4' })
  address_id?: string;

  // @IsOptional()
  // @IsUUID()
  // guardian_id?: string;
}
