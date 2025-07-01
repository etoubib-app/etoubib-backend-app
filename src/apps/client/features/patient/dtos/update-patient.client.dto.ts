
import {
  IsString,
  IsDateString,
  IsOptional,
  IsUUID,
  MaxLength,
  IsAlphanumeric,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// TODO: add swagger placeholders 
export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsAlphanumeric()
  @ApiProperty({ example: 'John' })
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
  address_id?: string;

  // @IsOptional()
  // @IsUUID()
  // guardian_id?: string;
}
