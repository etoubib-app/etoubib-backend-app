import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
    @IsString()
    @MaxLength(200)
    @ApiProperty({ example: '123 Main Street, Casablanca Morocco' })
    address: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    @ApiProperty({ example: '20250' })
    postalCode: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @IsAlphanumeric()
    @ApiProperty({ example: 'Casablanca' })
    city: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @IsAlphanumeric()
    @ApiProperty({ example: 'Morocco' })
    country: string;
}