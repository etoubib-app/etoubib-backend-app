import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateClinicDto {
  @ApiProperty({
    description: 'The name of the clinic',
    example: 'Acme Health Clinic',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'The email of the clinic',
    example: ' [email protected]',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
